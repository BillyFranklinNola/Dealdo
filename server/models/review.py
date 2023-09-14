from config.mysqlconnection import connectToMySQL
from models import user, product
from dotenv import load_dotenv
import os
load_dotenv()

class Review:
    db = os.environ.get('ecommerce_schema')

    def __init__(self, data):
        self.id = data['id']
        self.user_id = data['user_id']
        self.product_id = data['product_id']
        self.content = data['content']
        self.rating = data['rating']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.creator = None

    @classmethod
    def add_review_api(cls, data):
        data = {'user_id' : data['user_id'],
                'product_id': data['product_id'],
                'content': data['content'],
                'rating' : data['rating']
                }
        query = """INSERT INTO reviews (user_id, product_id, content, rating)
                VALUES (%(user_id)s, %(product_id)s, %(content)s, %(rating)s);"""   
        connectToMySQL(cls.db).query_db(query, data)

    @staticmethod
    def validate_review_creation_data_api(data):
        is_valid = True
        errors = {}
        if not product.Product.is_valid_product_id(data['product_id']):
            errors['product_id'] = []
            errors['product_id'].append('Invalid product id')
            return False, errors
        if len(data['content']) < 1:
            errors['content'] = []
            errors['content'].append('Review cannot be blank')
            is_valid = False
        if not Review.is_number(data['rating']):
            errors['rating'] = []
            errors['rating'].append('Rating must be a number')
            is_valid = False
        if not user.User.isValid_user_id(data['user_id']):
            errors['user_id'] = []
            errors['user_id'].append('Invalid User id')
            is_valid = False
        return is_valid, errors
   
    @staticmethod
    def serialize_review(review):
        review_dict = {
            'review_id': int(review.id),
            'user_id': int(review.user_id),
            'product_id': int(review.product_id),
            'content': review.content,
            'rating' : int(review.rating),
            'creator' : user.User.serialize_user(review.creator),
            'created_at': review.created_at,
            'updated_at': review.updated_at
        }
        return review_dict
    
    @staticmethod
    def is_number(data):
        try:
            float(data)
            return True
        except ValueError:
            return False