from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from . import db 

migrate = Migrate()

def init_app(app):
    db.init_app(app)
    migrate.init_app(app, db)