import jwt
from functools import wraps
from flask import request, jsonify, current_app, session

def token_required(required_privileges=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            authorization_header = request.headers.get('Authorization')

            if authorization_header and authorization_header.startswith('Bearer '):
                token = authorization_header.split(' ')[1]

                try:
                    # Verify the token using the same secret key used for signing
                    decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                    user_id = decoded_token['user_id']
                    
                    # Check if the user's privileges match the required privileges
                    if required_privileges:
                        user_privileges = None # Get_user_privileges_from_database, Replace with actual database query
                        if not set(required_privileges).issubset(user_privileges):
                            return jsonify(message="Insufficient privileges"), 403
                    
                    session['user_id'] = user_id

                    return f(*args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return jsonify(message="Token has expired"), 401
                except jwt.DecodeError:
                    return jsonify(message="Invalid token"), 401

            return jsonify(message="Unauthorized"), 401
        
        return decorated
    return decorator
