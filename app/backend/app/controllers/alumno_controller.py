from flask import Blueprint, jsonify, request

from app.models.alumno_model import Alumno
from app.views.alumno_view import render_alumno_list

alumno_bp = Blueprint("alumno",__name__)

@alumno_bp.route("/alumnos",methods = ["GET"])
def get_alumnos():
    alumnos = Alumno.get_all()
    return jsonify(render_alumno_list(alumnos))