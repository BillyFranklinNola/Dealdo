from config.mysqlconnection import connectToMySQL
from werkzeug.utils import secure_filename
from models.product import Product
from dotenv import load_dotenv
import os, uuid
load_dotenv()

db = os.environ.get('DATABASE')
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 2 MB (adjust as needed)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_product_image(file, product_id):
    target = os.path.join(UPLOAD_FOLDER, 'product_images', product_id)
    if not os.path.isdir(target):
        os.mkdir(target)
    
    try:
        filename = secure_filename(file.filename)
        if allowed_file(filename):
            this_product = Product.get_product_by_id(product_id)
            if not this_product.img_filename == 'default.png' :
                delete_product_image(this_product.img_filename)
            if file.content_length <= MAX_IMAGE_SIZE:
                unique_id = str(uuid.uuid4().hex)
                unique_file_name = f"{product_id}_{unique_id}_{filename}"
                destination = os.path.join(target, unique_file_name)
                file.save(destination)
                data = {
                    "id":product_id,
                    'img_filename': unique_file_name
                }
                query = """UPDATE products SET
                       img_filename=%(img_filename)s
                       WHERE id=%(id)s;"""
                connectToMySQL(db).query_db(query, data)
                response = "File upload complete"
                return response, unique_file_name
            else:
                response = "File size exceeds the allowed limit"
                return response, None
        else:
            response = "File type not allowed"
            return response, None
    except Exception as e:
        response = "File upload failed"
        return response, None

def get_product_image(file_name):
    parts = file_name.split('_')
    if len(parts) > 1:
        product_id = parts[0]
        file_path = os.path.join(UPLOAD_FOLDER, 'product_images', product_id, file_name)
        if os.path.exists(file_path):
            return file_path
    default_file_name = 'default.png'
    return os.path.join(UPLOAD_FOLDER, 'product_images', default_file_name)

def delete_product_image(file_name):
    parts = file_name.split('_')
    if len(parts) > 1:
        product_id = parts[0]
        file_path = os.path.join(UPLOAD_FOLDER, 'product_images', product_id, file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    return False