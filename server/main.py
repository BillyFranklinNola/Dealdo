from flask_cors import CORS
from controllers.users_api import users_bp
from controllers.products_api import products_bp
from controllers.carts_api import carts_bp
from controllers.reviews_api import reviews_bp
from controllers.image_api import img_bp
from app import app

app.register_blueprint(users_bp)
app.register_blueprint(products_bp)
app.register_blueprint(carts_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(img_bp)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

if __name__=='__main__':
    app.run()