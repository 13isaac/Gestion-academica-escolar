from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required,roles_required

from app.views.profesor_view import render_profesor, render_profesor_list
from app.models.profesor_model import Profesor

profesor_bp = Blueprint("profesor", __name__)

@profesor_bp.route("/profesores", methods = ["GET"])
@jwt_required
@roles_required(rol = ["admin"])
def get_profesores():
    profesores = Profesor.get_all()
    return jsonify(render_profesor_list(profesores))

@profesor_bp.route("/profesores/<int:id>", methods = ["GET"])
@jwt_required
@roles_required(rol = ["admin", "user"])
def get_profesor(id):
    profesor = Profesor.get_by_id(id)
    if profesor:
        return jsonify(render_profesor(profesor))
    
    return jsonify({"message":"Profesor no encontrado"}), 401