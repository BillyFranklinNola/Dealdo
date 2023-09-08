from flask import Flask
from config.app_config import Config, DevelopmentConfig

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)