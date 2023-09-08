from config.mysqlconnection import connectToMySQL
from models import product
from models import user
from dotenv import load_dotenv
import os
load_dotenv()

class Cart:
    db = os.environ.get('DATABASE_NAME')

    query_select_cart = """SELECT carts.*,
                   GROUP_CONCAT(products.id SEPARATOR '^') AS product_ids,
                   GROUP_CONCAT(products.user_id SEPARATOR '^') AS product_user_ids,
                   GROUP_CONCAT(products.name SEPARATOR '^') AS product_names,
                   GROUP_CONCAT(products.description SEPARATOR '^') AS product_descriptions,
                   GROUP_CONCAT(products.category SEPARATOR '^') AS product_categories,
                   GROUP_CONCAT(products.quantity SEPARATOR '^') AS product_quantities,
                   GROUP_CONCAT(products_in_carts.quantity_in_cart SEPARATOR '^') AS product_quantities_in_cart,
                   GROUP_CONCAT(products_in_carts.purchase_price SEPARATOR '^') AS product_purchase_prices,
                   GROUP_CONCAT(products.price SEPARATOR '^') AS product_prices,
                   GROUP_CONCAT(products.img_url SEPARATOR '^') AS product_img_urls,
                   GROUP_CONCAT(products.created_at SEPARATOR '^') AS product_created_ats,
                   GROUP_CONCAT(products.updated_at SEPARATOR '^') AS product_updated_ats
                   FROM carts
                   LEFT JOIN products_in_carts ON carts.id = products_in_carts.cart_id
                   LEFT JOIN products ON products_in_carts.product_id = products.id
                   """

    def __init__(self, data):
        self.id = data['id']
        self.user_id = data['user_id']
        self.is_paid = data['is_paid']
        self.total = 0.00
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.products_in_cart = []

    @classmethod
    def create_new_cart(cls, user_id):
        create_cart_query = """INSERT INTO carts (user_id) VALUES (%(user_id)s);"""
        connectToMySQL(cls.db).query_db(create_cart_query, {'user_id':user_id})
    
    @classmethod
    def add_to_cart(cls, data):
        data = {'user_id' : data['user_id'],
                'product_id': data['product_id'],
                'quantity_in_cart' : data['quantity_to_purchase']
        }
        
        this_product = product.Product.get_product_by_id(data['product_id'])
        if data['quantity_in_cart'] > this_product.quantity:
            return False
        
        # Find users current unpaid cart
        get_cart_query = """SELECT id FROM carts WHERE user_id = %(user_id)s AND is_paid = False;"""
        get_cart_result = connectToMySQL(cls.db).query_db(get_cart_query, data)
        cart_id = get_cart_result[0]['id']
        data['cart_id'] = cart_id
        
        # Look for product already in cart
        product_in_cart_query = """SELECT * FROM products_in_carts WHERE cart_id = %(cart_id)s AND product_id = %(product_id)s;"""
        product_in_cart_result = connectToMySQL(cls.db).query_db(product_in_cart_query, data)
        if product_in_cart_result == () or product_in_cart_result == False:
            add_item_to_cart_query = """INSERT INTO products_in_carts (cart_id, product_id, quantity_in_cart)
                                        VALUES (%(cart_id)s, %(product_id)s, %(quantity_in_cart)s);"""
            connectToMySQL(cls.db).query_db(add_item_to_cart_query, data)
        else:
            data['quantity_in_cart'] = int(data['quantity_in_cart']) + int(product_in_cart_result[0]['quantity_in_cart'])
            if int(data['quantity_in_cart']) <= int(this_product.quantity):
                update_item_in_cart_quantity = """UPDATE products_in_carts SET
                                                quantity_in_cart = %(quantity_in_cart)s
                                                WHERE cart_id = %(cart_id)s AND product_id = %(product_id)s;"""
                connectToMySQL(cls.db).query_db(update_item_in_cart_quantity, data)
            else:
                return False
        return True
    
    @classmethod
    def view_cart_by_user_id(cls, user_id):
        data = {'user_id': user_id}
        query = cls.query_select_cart + "WHERE carts.user_id = %(user_id)s AND carts.is_paid = False GROUP BY carts.id;"
        results = connectToMySQL(cls.db).query_db(query, data)
        cart = cls.build_cart_object_array_from_results(results)   
        return cart[0] if cart else cart
    
    @classmethod
    def get_all_paid_carts_by_user_id(cls, user_id):
        data = {'user_id': user_id}
        query = cls.query_select_cart + "WHERE carts.user_id = %(user_id)s AND carts.is_paid = True GROUP BY carts.id;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_cart_object_array_from_results(results)
    
    @classmethod
    def checkout_cart(cls,cart):
        # data = {
        #     'cart_id': data['cart_id'],
        #     'user_id': data['user_id']
        # }
        # cart = cls.view_cart_by_user_id(data['user_id'])
        is_valid, unavailable_products = cls.has_valid_product_purchase_quantity(cart)
        if not is_valid:
            return False, unavailable_products
        
        for product in cart.products_in_cart:
            product_data = {
                'quantity': int(product.quantity) - int(product.quantity_in_cart),
                'product_id': product.id
            }
            update_item_in_cart_quantity_query = """UPDATE products SET
                                              quantity = %(quantity)s
                                              WHERE id = %(product_id)s;"""
            connectToMySQL(cls.db).query_db(update_item_in_cart_quantity_query, product_data)
            cart_data = {
                "cart_id" : cart.id,
                "product_id": int(product.id),
                "purchase_price" : product.price
            }
            set_product_purchase_price_query = """UPDATE products_in_carts SET
                                            purchase_price = %(purchase_price)s
                                            WHERE cart_id = %(cart_id)s AND product_id = %(product_id)s;"""
            connectToMySQL(cls.db).query_db(set_product_purchase_price_query, cart_data)

        query = """UPDATE carts SET
                   is_paid = True
                   WHERE id = %(cart_id)s;"""
        connectToMySQL(cls.db).query_db(query, {'cart_id':cart.id})
        cls.create_new_cart(cart.user_id)
        return True, []

    @classmethod
    def edit_product_quantity_in_cart(cls, data):
        data = {
            "cart_id" : data['cart_id'],
            "product_id" : data['product_id'],
            "quantity_in_cart" : data['quantity_to_purchase']
        }
        this_product = product.Product.get_product_by_id(data['product_id'])
        if not data['quantity_in_cart'] == 0 and this_product.quantity >= int(data['quantity_in_cart']):
            update_item_in_cart_quantity = """UPDATE products_in_carts SET
                                            quantity_in_cart = %(quantity_in_cart)s
                                            WHERE cart_id = %(cart_id)s AND product_id = %(product_id)s;"""
            connectToMySQL(cls.db).query_db(update_item_in_cart_quantity, data)
        elif data['quantity_in_cart'] == 0:
            cls.remove_item_from_cart(data)
            return True
        else:
            return False

    @classmethod
    def empty_cart(cls, cart_id):
        query = """DELETE FROM products_in_carts
                   WHERE cart_id = %(id)s;"""
        connectToMySQL(cls.db).query_db(query,{'id':cart_id})
        return True

    @classmethod
    def remove_item_from_cart(cls, data):
        data = {
            "cart_id" : data['cart_id'],
            "product_id" : data['product_id']
        }
        query = """DELETE FROM products_in_carts
                   WHERE cart_id = %(cart_id)s AND product_id = %(product_id)s;"""
        connectToMySQL(cls.db).query_db(query, data)

    @classmethod
    def serialize_cart(cls, cart):
        serialized_data = {
                'cart_id': cart.id,
                'user_id': cart.user_id,
                'is_paid' : cart.is_paid,
                'created_at': cart.created_at,
                'updated_at': cart.updated_at,
                'products_in_cart': [product.Product.serialize_product(this_product) for this_product in cart.products_in_cart]
        }
        return serialized_data
    
    @classmethod
    def serialize_cart_array(cls, carts):
        return [cls.serialize_cart(cart) for cart in carts]
    
    @staticmethod
    def build_cart_object_array_from_results(results):
        all_carts = []
        for result in results:
            one_cart = Cart(result)
            product_ids = result['product_ids'].split('^') if result['product_ids'] else ''
            product_user_ids = result['product_user_ids'].split('^') if result['product_user_ids'] else ''
            product_names = result['product_names'].split('^') if result['product_names'] else ''
            product_descriptions = result['product_descriptions'].split('^') if result['product_descriptions'] else ''
            product_categories = result['product_categories'].split('^') if result['product_categories'] else ''
            product_quantities = result['product_quantities'].split('^') if result['product_quantities'] else ''
            product_quantities_in_cart = result['product_quantities_in_cart'].split('^') if result['product_quantities_in_cart'] else ''
            product_prices = result['product_purchase_prices'].split('^') if result['product_purchase_prices'] else result['product_prices'].split('^') if result['product_prices'] else ''
            product_img_urls = result['product_img_urls'].split('^') if result['product_img_urls'] else ''
            product_created_ats = result['product_created_ats'].split('^') if result['product_created_ats'] else ''
            product_updated_ats = result['product_updated_ats'].split('^') if result['product_updated_ats'] else ''
            
            for i in range(len(product_ids)):
                product_data = {
                    'id': product_ids[i],
                    'user_id': product_user_ids[i],
                    'name': product_names[i],
                    'description': product_descriptions[i],
                    'category': product_categories[i],
                    'quantity': int(product_quantities[i]),
                    'quantity_in_cart': int(product_quantities_in_cart[i]),
                    'price': float(product_prices[i]),
                    'img_url': product_img_urls[i],
                    'creator' : user.User.get_user_by_id(product_user_ids[i]),
                    'created_at': product_created_ats[i],
                    'updated_at': product_updated_ats[i],
                }
                one_cart.total = one_cart.total + product_data['quantity_in_cart'] * product_data['price']
                one_cart.products_in_cart.append(product.Product(product_data))

            all_carts.append(one_cart)
        return all_carts
    
    @staticmethod
    def has_valid_product_purchase_quantity(cart):
        is_valid = True
        unavailable_products = []
        for product in cart.products_in_cart:
            if product.quantity < product.quantity_in_cart:
                is_valid = False
                unavailable_products.append(product)
        return is_valid, unavailable_products
    