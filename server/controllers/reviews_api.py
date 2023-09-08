from flask import Blueprint, request, session, jsonify
from auth.decorators import token_required
from models.review import Review

reviews_bp = Blueprint('reviews_api', __name__, url_prefix='/api/reviews')

@reviews_bp.route('/create', methods=['POST'])
@token_required()
def create_review_submit_api():
    data = request.get_json()
    data['user_id'] = session['user_id']
    session.clear()
    isValid, errors = Review.validate_review_creation_data_api(data) 
    if isValid:
        Review.add_review_api(data)
        return jsonify(message="Review added successfully"), 201
    return jsonify(message="Invalid data", error=errors), 400