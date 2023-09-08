from flask import Blueprint, request, session, jsonify
from auth.decorators import token_required
from models.cart import Cart
from models.product import Product

carts_bp = Blueprint('carts_api', __name__, url_prefix='/api/carts')

@carts_bp.route('/add_product', methods=['PUT'])
@token_required()
def add_product_to_cart_api():
    data = request.get_json()
    data['user_id'] = session['user_id']
    session.clear()
    if Cart.add_to_cart(data):
        return jsonify(message="Item added to cart", status="success"), 201
    return jsonify(message="Item quantity unavailable", status="fail"), 400

@carts_bp.route('/view/active')
@token_required()
def view_cart_api():
    user_id = session['user_id']
    session.clear()
    cart = Cart.view_cart_by_user_id(user_id)
    if cart:
        cart = Cart.serialize_cart(cart)
    return jsonify(data=cart), 200

@carts_bp.route('/view/paid')
@token_required()
def view_paid_carts_api():
    user_id = session['user_id']
    session.clear()
    return jsonify(data=Cart.serialize_cart_array(Cart.get_all_paid_carts_by_user_id(user_id))), 200

@carts_bp.route('/edit', methods=['PUT'])
@token_required()
def edit_cart_api():
    data = request.get_json()
    data['user_id'] = session['user_id']
    session.clear()
    if Cart.edit_product_quantity_in_cart(data):
        return jsonify(message="Quantity in cart updated", status="success"), 200
    return jsonify(message="Something went wrong"), 400

@carts_bp.route('/empty', methods=['PUT'])
@token_required()
def delete_cart_api():
    cart = Cart.view_cart_by_user_id(session['user_id'])
    if cart:
        Cart.empty_cart(cart.id)
        session.clear()
        return jsonify(message="Cart emptied"), 200
    return jsonify(message="Something went wrong"), 400

@carts_bp.route('/checkout', methods=['PUT'])
@token_required()
def checkout_cart_api():
    user_id = session['user_id']
    session.clear()
    cart = Cart.view_cart_by_user_id(user_id)
    if cart.products_in_cart:
        is_success, unavailable_products = Cart.checkout_cart(cart)
        if is_success:
            return jsonify(message="Cart paid", status="success"), 200
        return jsonify(message="Products Unavailable", data=Product.serialize_products_array(unavailable_products)), 400
    return jsonify(message="Cart empty"), 400