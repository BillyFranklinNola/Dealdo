from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from models.user import User

users_bp = Blueprint('users_api', __name__, url_prefix='/api/users')

@users_bp.route('/register', methods=['POST'])
def register_submit():
    form_data = request.get_json()
    if form_data:
        is_valid, response = User.validate_user_form_data(form_data)
        if is_valid:
            user = User.create_user(form_data)
             # Generate JWT token
            token_payload = {
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
            }
            token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')
            return jsonify(message="User created", data=User.serialize_user(user), token=token), 200
        else:
            return jsonify(message="Invalid data", error=response), 400
    return jsonify(message="Invalid Request"), 400

@users_bp.route('/<int:user_id>')
def get_user_api(user_id):
    user = User.get_user_by_id(user_id)
    if user:
        print(user)
        return jsonify(message="User found", data=User.serialize_user(user)), 200
    return jsonify(message="User not found", error="Invalid user id"), 404

@users_bp.route('/login', methods=['POST'])
def login_user_api():
    data = request.get_json()
    if data:
        is_valid, response = User.login_user_api(data)
        if is_valid:
            # Generate JWT token
            token_payload = {
                'user_id': response.id,
                'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
            }
            token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify(message="Valid credentials", token=token, data=User.serialize_user(response)), 200
        return jsonify(message="Invalid credentials", error=response), 400
    return jsonify(message="Invalid data"), 400
