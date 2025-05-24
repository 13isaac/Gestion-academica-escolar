from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

from app.models.usuario_model import Usuario

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/register", methods = ["POST"])
def register():
    data = request.json
    nombre_usuario = data.get("nombre_usuario")
    contraseña = data.get("contraseña")
    rol = data.get("rol")

    if not contraseña or not nombre_usuario:
        return jsonify({"error":"Se requiere nombre de usuario y contraseña"}), 400
    
    existing_user = Usuario.find_by_username(nombre_usuario)
    if existing_user:
        return jsonify({"error":"El nombre de usuario ya esta en uso"}), 400
    
    usuario = Usuario(nombre_usuario,contraseña,rol)
    usuario.save()

    return jsonify({"message":"Usuario creado exitosamente"}), 201

@usuario_bp.route("/login", methods = ["POST"])
def login():
    data = request.json
    nombre_usuario = data.get("nombre_usuario")
    contraseña = data.get("contraseña")

    usuario = Usuario.find_by_username(nombre_usuario)
    if usuario and check_password_hash(usuario.contraseña, contraseña):
        access_token = create_access_token(
            identity = {"nombre_usuario":usuario.nombre_usuario, "rol":usuario.rol}
        )
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error":"Crendenciales inválidas"}), 401