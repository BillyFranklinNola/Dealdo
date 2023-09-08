from flask import Blueprint, request, jsonify, send_file
from auth.decorators import token_required
from utils import file_utils

img_bp = Blueprint('img_api', __name__, url_prefix='/api/img')

@img_bp.route('/products/upload', methods=['POST'])
@token_required()
def upload_product_image():
    file = request.files['file']
    product_id = request.form.get('product_id')
    response, destination = file_utils.save_product_image(file, product_id)
    if destination is not None:
        return jsonify(message=response, data=destination), 200
    else:
        return jsonify(message=response), 400

@img_bp.route('/products/<product_image_file_name>', methods=['GET'])
def get_product_image(product_image_file_name):
    image_path = file_utils.get_product_image(product_image_file_name)
    if image_path:
        return send_file(image_path)
    return jsonify(message="Image not found"), 404

