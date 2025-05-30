from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required, roles_required

from app.models.alumno_model import Alumno
from app.views.alumno_view import render_alumno_list, render_alumno

alumno_bp = Blueprint("alumno",__name__)

@alumno_bp.route("/alumnos", methods = ["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor"])
def get_alumnos():
    alumnos = Alumno.get_all()
    return jsonify(render_alumno_list(alumnos))

@alumno_bp.route("/alumnos/<int:id>", methods = ["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor","user"])
def get_alumno(id):
    alumno = Alumno.get_by_id(id)
    if alumno:
        return jsonify(render_alumno(alumno))
    return jsonify({"error": "Alumno no encontrado"}), 401