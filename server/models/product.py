from config.mysqlconnection import connectToMySQL
from models import user, review
from app import app
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import re, os
load_dotenv()

bcrypt = Bcrypt(app)
VALID_CATEGORY_PATTERN = re.compile(r"^\s*(\w+(\s*,\s*\w+)*)?\s*$")

class Product:
    db = os.environ.get('DATABASE')

    query_get_all_products = """SELECT products.*, users.*,
                   GROUP_CONCAT(reviews.id SEPARATOR '^') AS review_by_ids,
                   GROUP_CONCAT(review_users.id SEPARATOR '^') AS review_by_user_ids,
                   GROUP_CONCAT(review_users.first_name SEPARATOR '^') AS review_by_first_names,
                   GROUP_CONCAT(review_users.last_name SEPARATOR '^') AS review_by_last_names,
                   GROUP_CONCAT(review_users.address SEPARATOR '^') AS review_by_addresses,
                   GROUP_CONCAT(review_users.email SEPARATOR '^') AS review_by_emails,
                   GROUP_CONCAT(review_users.password SEPARATOR '^') AS review_by_passwords,
                   GROUP_CONCAT(review_users.created_at SEPARATOR '^') AS review_by_user_created_ats,
                   GROUP_CONCAT(review_users.updated_at SEPARATOR '^') AS review_by_user_updated_ats,
                   GROUP_CONCAT(reviews.content SEPARATOR '^') AS review_by_contents,
                   GROUP_CONCAT(reviews.rating SEPARATOR '^') AS review_by_ratings,
                   GROUP_CONCAT(reviews.product_id SEPARATOR '^') AS review_by_product_ids,
                   GROUP_CONCAT(reviews.created_at SEPARATOR '^') AS review_by_created_ats,
                   GROUP_CONCAT(reviews.updated_at SEPARATOR '^') AS review_by_updated_ats
                   FROM products
                   LEFT JOIN users ON products.user_id = users.id
                   LEFT JOIN reviews ON products.id = reviews.product_id
                   LEFT JOIN users AS review_users ON reviews.user_id = review_users.id
                   """

    def __init__(self, data):
        self.id = data['id']
        self.user_id = data['user_id']
        self.name = data['name']
        self.description = data['description']
        self.category = data['category']
        self.quantity = data['quantity']
        self.price = data['price']
        self.img_filename = data['img_filename']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = data.get('creator', None)
        self.reviews = []
        self.quantity_in_cart = data.get('quantity_in_cart', None)

    @classmethod
    def add_product(cls, data):
        data = {'user_id' : data['user_id'],
                'name': data['name'],
                'description': data['description'],
                'category': data['category'],
                'quantity': data['quantity'],
                'price' : '{:.2f}'.format(float(data['price'])),
                'img_filename' : "default.png"}
        
        query = """INSERT INTO products (user_id, name, description, category, quantity, price, img_filename)
                VALUES (%(user_id)s, %(name)s, %(description)s, %(category)s, %(quantity)s, %(price)s, %(img_filename)s);"""
        return connectToMySQL(cls.db).query_db(query, data)
    
    @classmethod
    def get_product_by_id(cls, product_id):
        query = cls.query_get_all_products + "WHERE products.id = %(id)s;"
        results = connectToMySQL(cls.db).query_db(query, {"id":product_id})
        if results[0]['id']:
            one_product = cls.build_product_object_array_from_results(results)
            return one_product[0]
        else:
            return None
       
    @classmethod
    def get_all_products(cls, page, per_page):
        offset = (page - 1) * per_page
        data = {
            "per_page": per_page,
            "offset": offset
        }
        query = cls.query_get_all_products + "GROUP BY products.id LIMIT %(per_page)s OFFSET %(offset)s;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_product_object_array_from_results(results)
        
    @classmethod
    def get_all_products_by_name(cls, name, page, per_page):
        offset = (page - 1) * per_page
        data = {
            "name": name,
            "per_page": per_page,
            "offset": offset
        }
        query = cls.query_get_all_products + "WHERE INSTR(products.name, %(name)s) > 0 GROUP BY products.id LIMIT %(per_page)s OFFSET %(offset)s;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_product_object_array_from_results(results)

    @classmethod
    def get_all_products_by_category(cls, category, page, per_page):
        offset = (page - 1) * per_page
        data = {
            "category": category,
            "per_page": per_page,
            "offset": offset
        }
        query = cls.query_get_all_products + "WHERE INSTR(products.category, %(category)s) > 0 GROUP BY products.id LIMIT %(per_page)s OFFSET %(offset)s;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_product_object_array_from_results(results)

    @classmethod
    def get_all_products_by_description(cls, search_term, page, per_page):
        offset = (page - 1) * per_page
        data = {
            "description": search_term,
            "per_page": per_page,
            "offset": offset
        }
        query = cls.query_get_all_products + "WHERE INSTR(products.description, %(description)s) > 0 GROUP BY products.id LIMIT %(per_page)s OFFSET %(offset)s;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_product_object_array_from_results(results)
    
    @classmethod
    def get_all_products_by_user_id(cls, user_id, page, per_page):
        offset = (page - 1) * per_page
        data = {
            "id": user_id,
            "per_page": per_page,
            "offset": offset
        }
        query = cls.query_get_all_products + "WHERE products.user_id = %(id)s GROUP BY products.id LIMIT %(per_page)s OFFSET %(offset)s;"
        results = connectToMySQL(cls.db).query_db(query, data)
        return cls.build_product_object_array_from_results(results)
    
    @classmethod
    def edit_product(cls, data):
        if cls.is_valid_product_id(data['product_id']):
            data = {'name': data['name'],
                    'description': data['description'],
                    'category': data['category'],
                    'quantity': int(data['quantity']),
                    'price' : '{:.2f}'.format(float(data['price'])),
                    'id': int(data['product_id'])}
            
            query = """UPDATE products SET
                       name=%(name)s,
                       description=%(description)s,
                       category=%(category)s,
                       quantity=%(quantity)s,
                       price=%(price)s
                       WHERE id=%(id)s;"""
            connectToMySQL(cls.db).query_db(query, data)
            return True
        return False
    
    @classmethod
    def delete_product(cls, product_id):
        query = """DELETE FROM reviews
                    WHERE product_id = %(id)s;"""
        connectToMySQL(cls.db).query_db(query,{'id':product_id})
        query = """DELETE FROM products_in_carts
                    WHERE product_id = %(id)s;"""
        connectToMySQL(cls.db).query_db(query,{'id':product_id})
        query = """DELETE FROM products
                    WHERE id = %(id)s;"""
        return connectToMySQL(cls.db).query_db(query,{'id':product_id})
    
    @classmethod
    def validate_product_form_data(cls, data):
        is_valid = True
        errors = {}
        if 'product_id' in data and not cls.is_valid_product_id(data['product_id']):
            errors['product_id'] = ['Invalid product id']
            return False, errors
        if len(data['name']) < 1:
            errors['name'] = []
            errors['name'].append('Name cannot be blank')
            is_valid = False
        if len(data['description']) < 1:
            errors['description'] = []
            errors['description'].append('Description cannot be blank')
            is_valid = False
        if len(data['category'].strip()) < 1:
            errors['category'] = []
            errors['category'].append('Category cannot be blank')
            is_valid = False
        if not VALID_CATEGORY_PATTERN.match(data['category']):
            if 'category' not in errors:
                errors['category'] = [] 
            errors['category'].append('Categories must be one word and separted by commas. i.e. homegoods, furniture, etc...')
            is_valid = False
        if not Product.is_number(data['price']):
            if 'price' not in errors:
                errors['price'] = []
            errors['price'].append('Price must be numeric')
            is_valid = False
        elif float(data['price']) < 0.01:
            if 'price' not in errors:
                errors['price'] = []
            errors['price'].append("Price can't be less than 0.01")
            is_valid = False
        if not Product.is_number(data['quantity']):
            if 'quantity' not in errors:
                errors['quantity'] = []
            errors['quantity'].append('Quantity must be numeric')
            is_valid = False
        elif int(data['quantity']) < 0:
            errors['quantity'] = []
            errors['quantity'].append("Quantity can't be less than 0")
            is_valid = False
        return is_valid, errors
    
    @classmethod
    def is_valid_product_id(cls, id):
        query = """SELECT id FROM products
                   WHERE id = %(id)s;"""
        if connectToMySQL(cls.db).query_db(query, {'id' : id}):
            return True
        return False
    
    @classmethod
    def has_permission(cls, product_id, user_id):
        data = {
            'id':product_id,
            'user_id':user_id
        }
        query = """SELECT id, user_id FROM products
                   WHERE id = %(id)s AND user_id = %(user_id)s;"""
        if connectToMySQL(cls.db).query_db(query, data):
            return True
        return False
    
    @classmethod
    def serialize_product(cls, product):
        serialized_product = {
            'product_id': product.id,
            'user_id': product.user_id,
            'name': product.name,
            'description': product.description,
            'category': product.category,
            'quantity': product.quantity,
            'price': product.price,
            'img_filename': product.img_filename,
            'created_at': product.created_at,
            'updated_at': product.updated_at,
            'seller': user.User.serialize_user(product.creator),
            'reviews': [review.Review.serialize_review(this_review) for this_review in product.reviews]
        }
        if not product.quantity_in_cart == None:
            serialized_product['quantity_in_cart'] = product.quantity_in_cart

        return serialized_product
    
    @classmethod
    def serialize_products_array(cls,products):
        serialized_products = []

        for product in products:
            serialized_product = cls.serialize_product(product)
            serialized_products.append(serialized_product)

        return serialized_products
    
    @staticmethod
    def build_product_object_array_from_results(results):
        all_products = []
        for result in results:
            one_product = Product(result)
            one_product_creator_info = {
                'id': result['users.id'],
                'first_name': result['first_name'],
                'last_name': result['last_name'],
                'address': result['address'],
                'email': result['email'],
                'password': result['password'],
                'created_at': result['users.created_at'],
                'updated_at': result['users.updated_at']
            }
            one_product.creator = user.User(one_product_creator_info)

            review_by_ids = result['review_by_ids'].split('^') if result['review_by_ids'] else ''
            review_by_user_ids = result['review_by_user_ids'].split('^') if result['review_by_user_ids'] else ''
            review_by_first_names = result['review_by_first_names'].split('^') if result['review_by_first_names'] else ''
            review_by_last_names = result['review_by_last_names'].split('^') if result['review_by_last_names'] else ''
            review_by_addresses = result['review_by_addresses'].split('^') if result['review_by_addresses'] else ''
            review_by_emails = result['review_by_emails'].split('^') if result['review_by_emails'] else ''
            review_by_passwords = result['review_by_passwords'].split('^') if result['review_by_passwords'] else ''
            review_by_user_created_ats = result['review_by_user_created_ats'].split('^') if result['review_by_user_created_ats'] else ''
            review_by_user_updated_ats = result['review_by_user_updated_ats'].split('^') if result['review_by_user_updated_ats'] else ''
            review_by_product_ids = result['review_by_product_ids'].split('^') if result['review_by_product_ids'] else ''
            review_by_contents = result['review_by_contents'].split('^') if result['review_by_contents'] else ''
            review_by_ratings = result['review_by_ratings'].split('^') if result['review_by_ratings'] else ''
            review_by_created_ats = result['review_by_created_ats'].split('^') if result['review_by_created_ats'] else ''
            review_by_updated_ats = result['review_by_updated_ats'].split('^') if result['review_by_updated_ats'] else ''

            for i in range(len(review_by_ids)):
                review_creator_data = {
                'id': int(review_by_user_ids[i]),
                'first_name' : review_by_first_names[i],
                'last_name' : review_by_last_names[i],
                'address' : review_by_addresses[i],
                'email' : review_by_emails[i],
                'password': review_by_passwords[i],
                'created_at': review_by_user_created_ats[i],
                'updated_at': review_by_user_updated_ats[i]
                }
                one_product_review_by_info = {
                    'id': int(review_by_ids[i]),
                    'product_id': int(review_by_product_ids[i]),
                    'user_id': int(review_by_user_ids[i]),
                    'content': review_by_contents[i],
                    'rating': review_by_ratings[i],
                    'created_at': review_by_created_ats[i],
                    'updated_at': review_by_updated_ats[i]
                }
                this_review = review.Review(one_product_review_by_info)
                this_review.creator = user.User(review_creator_data)
                one_product.reviews.append(this_review)

            all_products.append(one_product)

        return all_products
    
    @staticmethod
    def is_number(data):
        try:
            float(data)
            return True
        except ValueError:
            return False