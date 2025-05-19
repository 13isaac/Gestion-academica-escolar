from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from database import db
from flask_cors import CORS

from app.controllers.alumno_controller import alumno_bp

app=Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"]="tu_clave_secreta_aqui"

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://ga_admin:Gestion123!@localhost/gestion_academica'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
#app.config["SQLALCHEMY_ECHO"] = True

from app.models.alumno_model import Alumno

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(alumno_bp, url_prefix = "/api")

migrate = Migrate(app, db)

def check_tables():
    with app.app_context():
        inspector = db.inspect(db.engine)
        #print("############# Tablas existentes:", inspector.get_table_names())

if __name__ == "__main__":
    #check_tables()
    with app.app_context():
        db.create_all()
    #check_tables()
    app.run(debug=True)