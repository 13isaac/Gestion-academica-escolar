import json
from app.database import db
from werkzeug.security import generate_password_hash
from flask_login import UserMixin

class Usuario(UserMixin, db.Model):
    __tablename__ = "usuarios"
    id_usuario = db.Column(db.Integer, primary_key = True)
    nombre_usuario = db.Column(db.String(50), nullable = False, unique = True)
    contraseña = db.Column(db.String(256), nullable = False)
    rol = db.Column(db.String(50), nullable = False)

    def __init__(self,nombre_usuario, contraseña, rol = ["user"]):
        self.nombre_usuario = nombre_usuario
        self.contraseña = generate_password_hash(contraseña)
        self.rol = json.dumps(rol)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def find_by_username(nombre_usuario):
        return Usuario.query.filter_by(nombre_usuario=nombre_usuario).first()

