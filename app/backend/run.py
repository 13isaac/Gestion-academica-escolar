import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.database import db
from flask_cors import CORS

from app.controllers.alumno_controller import alumno_bp
from app.controllers.profesor_controller import profesor_bp
from app.controllers.usuario_controller import usuario_bp
from app.controllers.asistencia_controller import asistencia_bp
from app.controllers.matricula_controller import matricula_bp
from app.controllers.curso_controller import curso_bp
from app.controllers.nota_controller import nota_bp

app=Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"]="tu_clave_secreta_aqui"

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://ga_admin:Gestion123!@localhost/gestion_academica'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config["SQLALCHEMY_ECHO"] = True

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(alumno_bp, url_prefix = "/api")
app.register_blueprint(profesor_bp, url_prefix = "/api")
app.register_blueprint(usuario_bp, url_prefix = "/api")
app.register_blueprint(matricula_bp, url_prefix = "/api")
app.register_blueprint(curso_bp, url_prefix = "/api")
app.register_blueprint(nota_bp, url_prefix = "/api")
app.register_blueprint(asistencia_bp, url_prefix = "/api")

migrate = Migrate(app, db)

def check_tables():
    with app.app_context():
        inspector = db.inspect(db.engine)
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)