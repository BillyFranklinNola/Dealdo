from flask import Blueprint, request, jsonify, session
from auth.decorators import token_required
from models.product import Product

products_bp = Blueprint('products_api', __name__, url_prefix='/api/products')

@products_bp.route('/create', methods=['POST'])
@token_required()
def create_product():
    data = request.get_json()
    data['user_id'] = session['user_id']
    session.clear()
    is_valid, errors = Product.validate_product_form_data(data)
    if is_valid:
        product_id = Product.add_product(data)
        if not product_id:
            return jsonify(message="Product creation failed"), 400
        return jsonify(message="Product created", status="success", data=Product.serialize_product(Product.get_product_by_id(product_id))), 201
    return jsonify(message="Invalid data", errors=errors), 400

@products_bp.route('', methods=['GET'])
def get_all_products_paginated():
    page = int(request.args.get('page', 1))  # Default to page 1
    per_page = int(request.args.get('per_page', 10))  # Default to 10 items per page

    products = Product.get_all_products(page, per_page)
    return jsonify(message="Paginated Products", data=Product.serialize_products_array(products)), 200


@products_bp.route('/view/<int:product_id>')
def view_product_api(product_id):
    this_product = Product.get_product_by_id(product_id)   
    if this_product is not None:
        return jsonify(message="Product found", data=Product.serialize_product(this_product)), 200
    else:
        return jsonify(message="Product not found", error="Invalid product id"), 404

@products_bp.route('/name/<string:search_term>')
def search_product_name_api(search_term):
    page = int(request.args.get('page', 1))  # Default to page 1
    per_page = int(request.args.get('per_page', 10))  # Default to 10 items per page

    all_products = Product.get_all_products_by_name(search_term, page, per_page)
    return jsonify(message="All products by description", data=Product.serialize_products_array(all_products)), 200

@products_bp.route('/category/<string:search_term>')
def search_product_category_api(search_term):
    page = int(request.args.get('page', 1))  # Default to page 1
    per_page = int(request.args.get('per_page', 10))  # Default to 10 items per page

    all_products = Product.get_all_products_by_category(search_term, page, per_page)
    return jsonify(message="All products by category", data=Product.serialize_products_array(all_products)), 200

@products_bp.route('/description/<string:search_term>')
def search_product_description_api(search_term):
    page = int(request.args.get('page', 1))  # Default to page 1
    per_page = int(request.args.get('per_page', 10))  # Default to 10 items per page

    all_products = Product.get_all_products_by_description(search_term, page, per_page)
    return jsonify(message="All products by description", data=Product.serialize_products_array(all_products)), 200

@products_bp.route('/user/<int:user_id>')
def all_user_products(user_id):
    page = int(request.args.get('page', 1))  # Default to page 1
    per_page = int(request.args.get('per_page', 10))  # Default to 10 items per page

    all_products = Product.get_all_products_by_user_id(user_id, page, per_page)
    return jsonify(message="All products by user id", data=Product.serialize_products_array(all_products)), 200

@products_bp.route('/edit', methods=['PUT'])
@token_required()
def edit_product_submit_api():
    data = request.get_json()
    data['user_id'] = session['user_id']
    session.clear()
    if not Product.has_permission(data['product_id'], data['user_id']):
        return jsonify(message="Unauthorized access"), 401
    is_valid, errors = Product.validate_product_form_data(data)
    if is_valid:
        if Product.edit_product(data):
            return jsonify(message="success", data=Product.serialize_product(Product.get_product_by_id(data['product_id']))), 200
        return jsonify(message="something went wrong"), 400
    return jsonify(message="Invalid data", error=errors), 400

@products_bp.route('/delete/<int:product_id>', methods=['DELETE'])
@token_required()
def delete_product_api(product_id):
    if not Product.has_permission(product_id, session['user_id']):
        session.clear()
        return jsonify(message="Unauthorized access"), 401
    Product.delete_product(product_id)
    session.clear
    return jsonify(message="Product deleted"), 200
