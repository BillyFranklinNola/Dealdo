from dotenv import load_dotenv
import os

load_dotenv()

db = os.environ.get('db')

class Config:
    # Add other configuration options here
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = False

class DevelopmentConfig(Config):
    # Add development-specific configurations
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = True

class ProductionConfig(Config):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = False
    # Add production-specific configurations
