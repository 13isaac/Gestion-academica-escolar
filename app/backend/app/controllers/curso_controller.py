from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required, roles_required

from app.models.curso_model import Curso
from app.views.curso_view import render_curso, render_curso_list

curso_bp = Blueprint("curso", __name__)

@curso_bp.route("/cursos", methods=["GET"])
@jwt_required
@roles_required(rol=["admin", "profesor"])
def get_cursos():
    cursos = Curso.get_all()
    return jsonify(render_curso_list(cursos))

@curso_bp.route("/cursos/<int:id>", methods=["GET"])
@jwt_required
@roles_required(rol=["admin", "profesor", "user"])
def get_curso(id):
    curso = Curso.get_by_id(id)
    if curso:
        return jsonify(render_curso(curso))
    return jsonify({"message": "Curso no encontrado"}), 401