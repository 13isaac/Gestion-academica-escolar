from flask import Blueprint, jsonify, request

from app.utils.decorators import jwt_required, roles_required

from app.models.asistencia_model import Asistencia
from app.views.asistencia_view import render_asistencia_detail, render_asistencia_list

asistencia_bp = Blueprint("asistencia", __name__)

#Lista de Asistencia
@asistencia_bp.route("/asistencias", methods=["GET"])
#@jwt_required
#@roles_required(rol=["admin", "profesor"])
def get_asistencias():
    asistencias = Asistencia.get_all()
    return jsonify(render_asistencia_list(asistencias))

#Obtener por ID
@asistencia_bp.route("/asistencias/<int:id>", methods=["GET"])
#@jwt_required
#@roles_required(rol=["admin", "profesor", "user"])
def get_asistencia(id):
    asistencia = Asistencia.get_by_id(id)
    if asistencia:
        return jsonify(render_asistencia_detail(asistencia))
    return jsonify({"message": "Asistencia no encontrada"}), 401

#Crear nueva Asistencia
@asistencia_bp.route("/asistencias", methods = ["POST"])
#@jwt_required
#@roles_required(rol=["profesor", "admin"])
def create_asistencia():
    data = request.json
    id_alumno = data.get("id_alumno")
    id_curso = data.get("id_curso")
    fecha = data.get("fecha")
    sesion = data.get("sesion")
    estado_asistencia = data.get("estado_asistencia")

    if not id_alumno or not id_curso or not fecha or not sesion or not estado_asistencia:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    asistencia = Asistencia(id_alumno=id_alumno, id_curso=id_curso, fecha=fecha, sesion=sesion, estado_asistencia=estado_asistencia)
    asistencia.save()

    return jsonify(render_asistencia_detail(asistencia)), 201

#Actualizar Asistencia
@asistencia_bp.route("/asistencias/<int:id>", methods=["PUT"])
#@jwt_required
#@roles_required(rol=["admin", "profesor"])
def update_asistencia(id):
    asistencia = Asistencia.get_by_id(id)

    if not asistencia:
        return jsonify({"error": "Asistencia no encontrada"}), 404
    
    data = request.json
    id_alumno = data.get("id_alumno")
    id_curso = data.get("id_curso")
    fecha = data.get("fecha")
    sesion = data.get("sesion")
    estado_asistencia = data.get("estado_asistencia")

    asistencia.update(id_alumno=id_alumno, id_curso=id_curso, fecha=fecha, sesion=sesion, estado_asistencia=estado_asistencia)
    return jsonify(render_asistencia_detail(asistencia))

#Eliminar Asistencia
@asistencia_bp.route("/asistencias/<int:id>", methods=["DELETE"])
#@jwt_required
#@roles_required(rol=["admin", "profesor"])
def delete_asistencia(id):
    asistencia = Asistencia.get_by_id(id)

    if not asistencia:
        return jsonify({"error": "Asistencia no encontrada"}), 404
    
    asistencia.delete()

    return "", 204