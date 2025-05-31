from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required, roles_required

from app.models.matricula_model import Matricula
from app.views.matricula_view import render_matricula, render_matricula_list

matricula_bp = Blueprint("matricula", __name__)

@matricula_bp.route("/matriculas", methods=["GET"])
@jwt_required
@roles_required(["admin", "profesor", "user"])
def get_matriculas():
    matriculas = Matricula.get_all()
    return jsonify(render_matricula_list(matriculas))

@matricula_bp.route("/matriculas/<int:id>", methods=["GET"])
@jwt_required
@roles_required(rol=["admin", "profesor", "user"])
def get_matricula(id):
    matricula = Matricula.get_by_id(id)
    if matricula:
        return jsonify(render_matricula(matricula))
    return jsonify({"message": "Matricula no encontrada"}), 401