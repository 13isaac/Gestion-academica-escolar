from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from flask import Blueprint, request, jsonify
from sqlalchemy import text
from app.database import db
from app.models.usuario_model import Usuario
from werkzeug.security import check_password_hash

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

        return jsonify(
            access_token=access_token,
            nombre_usuario=usuario.nombre_usuario,
            rol=usuario.rol
        ), 200
    
    else:
        return jsonify({"error":"Crendenciales inválidas"}), 401
    
@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()  # Obtener todos los usuarios
    lista_usuarios = []

    for u in usuarios:
        lista_usuarios.append({
            "id_usuario": u.id_usuario,
            "nombre_usuario": u.nombre_usuario,
            "rol": u.rol
            # No incluir la contraseña por seguridad
        })

    return jsonify(lista_usuarios), 200

#NIVELES DE DVWA
@usuario_bp.route("/login_low", methods=["POST"])
def login_low():
    try:
        data = request.get_json()
        nombre_usuario = data.get("nombre_usuario")
        contraseña = data.get("contraseña")

        if not nombre_usuario or not contraseña:
            return jsonify({"error": "Falta usuario o contraseña"}), 400

        query = text(f"""
            SELECT * FROM usuarios 
            WHERE nombre_usuario = '{nombre_usuario}' 
            AND contraseña = '{contraseña}'
        """)

        with db.engine.connect() as conn:
            result = conn.execute(query)
            #user = result.fetchone()   #devuelve solo uno
            user = result.fetchall()    #devuelve varios

        if user:
            user_dict = [dict(user._mapping) for user in user]
            #user_dict = dict(user._mapping)
            return jsonify({"msg": "Login exitoso (LOW)", "user": user_dict})
        else:
            return jsonify({"msg": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@usuario_bp.route("/login_medium", methods=["POST"])
def login_medium():
    try:
        data = request.get_json()
        nombre_usuario = data.get("nombre_usuario")
        contraseña = data.get("contraseña")

        if not nombre_usuario or not contraseña:
            return jsonify({"error": "Faltan nombre_usuario o contraseña"}), 400

        # Validación básica anti-injection
        caracteres_peligrosos = ["'", '"', "--", ";", "/*", "*/"]
        for c in caracteres_peligrosos:
            if c in nombre_usuario or c in contraseña:
                return jsonify({"error": f"Caracteres inválidos detectados: {c}"}), 400

        query = text(f"""
            SELECT * FROM usuarios 
            WHERE nombre_usuario = {nombre_usuario}
            AND contraseña = {contraseña}
        """)

        with db.engine.connect() as conn:
            result = conn.execute(query)
            user = result.fetchone()

        if user:
            return jsonify({
                "msg": "Login exitoso (MEDIUM - vulnerable sin comillas)",
                "user": dict(user._mapping)
            })
        else:
            return jsonify({"msg": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@usuario_bp.route("/login_high", methods=["POST"])
def login_high():
    try:
        data = request.get_json()
        nombre_usuario = data.get("nombre_usuario")
        contraseña = data.get("contraseña")

        if not nombre_usuario or not contraseña:
            return jsonify({"error": "Faltan nombre_usuario o contraseña"}), 400

        query = text("""
            SELECT * FROM usuarios 
            WHERE nombre_usuario = :usuario
        """)

        with db.engine.connect() as conn:
            result = conn.execute(query, {"usuario": nombre_usuario})
            user = result.fetchone()

        if user:
            # Aquí verificar la contraseña hasheada, por ejemplo con werkzeug.security
            from werkzeug.security import check_password_hash

            if check_password_hash(user._mapping["contraseña"], contraseña):
                user_dict = dict(user._mapping)
                return jsonify({"msg": "Login exitoso (HIGH)", "user": user_dict})
            else:
                return jsonify({"msg": "Credenciales inválidas"}), 401
        else:
            return jsonify({"msg": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

