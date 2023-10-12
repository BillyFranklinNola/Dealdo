from config.mysqlconnection import connectToMySQL
from models import cart
from app import app
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import re, os
load_dotenv()

bcrypt = Bcrypt(app)
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-z]+$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&+=])(?=.*[a-z]).{8,}$')
ADDRESS_REGEX = re.compile(r'^(.*),\s*(.*),\s*([A-Za-z]{2}),\s*(\d{5}(?:-\d{4})?)$')

class User:
    db = os.environ.get('DATABASE')

    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.address = data['address']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def create_user(cls, data):
        is_valid, errors = cls.validate_user_form_data(data)
        if is_valid:
            data = cls.parse_user_form_data(data)
            query = """INSERT INTO users (first_name, last_name, address, email, password)
                    VALUES (%(first_name)s, %(last_name)s, %(address)s, %(email)s, %(password)s);"""   
            user_id = connectToMySQL(cls.db).query_db(query, data)
            cart.Cart.create_new_cart(user_id)
            return User.get_user_by_id(user_id)
        return errors

    @classmethod
    def get_user_by_id(cls, id):
        query = """SELECT * FROM users
                   WHERE id=%(id)s;"""
        results = connectToMySQL(cls.db).query_db(query, {'id': id})
        return cls(results[0]) if results else False
    
    @classmethod
    def get_all_users(cls):
        query = "SELECT * FROM users"
        results = connectToMySQL(cls.db).query_db(query)
        return [cls(user) for user in results] if results else results
            
    @classmethod
    def get_user_by_email(cls, email):
        query = """SELECT * FROM users
                   WHERE email=%(email)s;"""
        results = connectToMySQL(cls.db).query_db(query, {'email': email.lower().strip()})
        return (cls(results[0])) if results else False
    
    @classmethod
    def update_user(cls, data):
        if cls.validate_user_form_data(data):
            data = cls.parse_user_form_data(data)
            query = """UPDATE users
                    SET first_name=%(first_name)s, last_name=%(last_name)s, address=%(address)s, email=%(email)s
                    WHERE id=%(id)s;"""
            connectToMySQL(cls.db).query_db(query, data)
            return True
        return False
    
    @classmethod
    ### BROKEN : WIll have to delete all user products, reviews, carts, and products in carts to delete user.
    def delete_user(cls, user_id):
        query = """DELETE FROM users
                   WHERE id=%(id)s;"""
        return connectToMySQL(cls.db).query_db(query, {'id':user_id})

    @staticmethod
    def login_user_api(data):
        user = User.get_user_by_email(data['email'])
        if user and bcrypt.check_password_hash(user.password, data['password']):
            return True, user
        errors = {
            'email' : ["Invalid Credentials"],
            'password' : ["Invalid Credentials"]
        }
        return False, errors
    
    @classmethod
    def isValid_user_id(cls, id):
        data = {'id' : id}
        query = """SELECT id FROM users
                   WHERE id = %(id)s;"""
        if connectToMySQL(cls.db).query_db(query, data):
            return True
        return False

    @staticmethod
    def parse_user_form_data(data):
        parsed_data = {}
        parsed_data['first_name'] = data['first_name'].strip()
        parsed_data['last_name'] = data['last_name'].strip()
        parsed_data['address'] = data['address'].strip()
        parsed_data['email'] = data['email'].lower().strip()
        if 'user_id' in data:
            parsed_data['id'] = data['user_id']
        else:
            parsed_data['password'] = bcrypt.generate_password_hash(data['password'])
        return parsed_data
    
    @staticmethod
    def serialize_user(user):
        serialized_user = {
            'user_id': int(user.id),
            'first_name': user.first_name,
            'last_name': user.last_name,
            'address': user.address,
            'email': user.email,
            'created_at': user.created_at,
            'updated_at': user.updated_at
        }
        return serialized_user

    @staticmethod
    def validate_user_form_data(data):
        is_valid = True
        errors = {}
        if not data['first_name'].replace(' ','').isalpha():
            errors['first_name'] = []
            errors['first_name'].append('First name cannot contain numbers')
            is_valid = False
        if len(data['first_name']) < 1:
            if 'first_name' not in errors:
                errors['first_name'] = []
            errors['first_name'].append('First name cannot be blank')
            is_valid = False
        if len(data['first_name']) > 45:
            if 'first_name' not in errors:
                errors['first_name'] = []
            errors['first_name'].append('First name is too long')
            is_valid = False
        if not data['last_name'].replace(' ','').isalpha():
            errors['last_name'] = []
            errors['last_name'].append('Last name cannot contain numbers')  
            is_valid = False      
        if len(data['last_name']) < 1:
            if 'last_name' not in errors:
                errors['last_name'] = []
            errors['last_name'].append('Last name cannot be blank')
            is_valid = False
        if len(data['last_name']) > 45:
            if 'last_name' not in errors:
                errors['last_name'] = []
            errors['last_name'].append('Last name is too long')
        if not ADDRESS_REGEX.match(data['address']):
            errors['address'] = []
            errors['address'].append('Address format must be : street address, city, state, 5 digit zip')
            is_valid = False
        if len(data['address']) > 245:
            if 'address' not in errors:
                errors['address'] = []
            errors['address'].append('Address is too long')
        if len(data['email']) > 45:
            errors['email'] = []
            errors['email'].append('Email is too long')
        if not EMAIL_REGEX.match(data['email'].lower().strip()):
            if 'email' not in errors:
                errors['email'] = []
            errors['email'].append('Invalid email address.')
            is_valid = False
        if User.get_user_by_email(data['email']):
            if 'email' not in errors:
                errors['email'] = []
            errors['email'].append('Email address already registered')
            is_valid = False
        if len(data['password']) < 8:
            errors['password'] = []
            errors['password'].append('Password must be at least 8 characters long')
            is_valid = False
        if not PASSWORD_REGEX.match(data['password']):
            if 'password' not in errors:
                errors['password'] = []
            errors['password'].append('Password requires one captial, one digit, and one of the following symbols : !@#$%^&+=')
            is_valid = False
        if data['password'] != data['confirm_password']:
            if 'password' not in errors:
                errors['password'] = []
            errors['password'].append('The paswords do not macth')
            is_valid = False
        return is_valid, errors