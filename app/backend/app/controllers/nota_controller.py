from flask import Blueprint, jsonify, request

from app.utils.decorators import jwt_required, roles_required

from app.models.nota_model import Notas
from app.models.curso_model import Curso
from app.models.alumno_model import Alumno
from app.models.asistencia_model import Asistencia
from app.views.nota_view import render_nota_detail, render_nota_list
from app.views.asistencia_view import render_asistencia_list

nota_bp = Blueprint("nota", __name__)

#Lista de Notas
@nota_bp.route("/notas", methods=["GET"])
@jwt_required
@roles_required(rol=["admin", "profesor"])
def get_notas():
    notas = Notas.get_all()
    return jsonify(render_asistencia_list(notas))
    

#Obtener por ID
@nota_bp.route("/notas/<int:id>", methods=["GET"])
@jwt_required
@roles_required(rol=["admin", "profesor", "user"])
def get_nota(id):
    nota = Notas.get_by_id(id)
    if nota:
        return jsonify(render_nota_detail(nota))
    return jsonify({"message": "Nota no encontrada"}), 401

#Crear nueva Nota
@nota_bp.route("/notas", methods = ["POST"])
@jwt_required
@roles_required(rol=["profesor", "admin"])
def create_nota():
    data = request.json
    id_alumno = data.get("id_alumno")
    id_curso = data.get("id_curso")
    evaluacion = data.get("evaluacion")
    tipo_evaluacion = data.get("tipo_evaluacion")
    calificacion = data.get("calificacion")
    fecha = data.get("fecha")

    if not id_alumno or not id_curso or not evaluacion or not tipo_evaluacion or not calificacion or not fecha:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    nota = Notas(id_alumno=id_alumno, id_curso=id_curso, evaluacion=evaluacion, tipo_evaluacion=tipo_evaluacion, calificacion=calificacion, fecha=fecha)
    nota.save()

    return jsonify(render_nota_detail(nota)), 201

#Actualizar Nota
@nota_bp.route("/notas/<int:id>", methods=["PUT"])
@jwt_required
@roles_required(rol=["profesor", "admin"])
def update_nota(id):
    nota = Notas.get_by_id(id)

    if not nota:
        return jsonify({"error": "nota no encontrada"}), 404
    
    data = request.json
    id_alumno = data.get("id_alumno")
    id_curso = data.get("id_curso")
    evaluacion = data.get("evaluacion")
    tipo_evaluacion = data.get("tipo_evaluacion")
    calificacion = data.get("calificacion")
    fecha = data.get("fecha")

    nota.update(id_alumno=id_alumno, id_curso=id_curso, evaluacion=evaluacion, tipo_evaluacion=tipo_evaluacion, calificacion=calificacion, fecha=fecha)
    return jsonify(render_nota_detail(nota))

#Eliminar Nota
@nota_bp.route("/notas/<int:id>", methods=["DELETE"])
@jwt_required
@roles_required(rol=["profesor", "admin"])
def delete_nota(id):
    nota = Notas.get_by_id(id)

    if not nota:
        return jsonify({"error": "nota no encontrada"}), 404
    
    nota.delete()

    return "", 204

@nota_bp.route("/notas/cursos/<int:id_curso>/alumnos/<int:id_alumno>", methods=["GET"])
@jwt_required
@roles_required(rol=["profesor", "admin"])
def get_notas_alumnos(id_curso, id_alumno):
    curso = Curso.get_by_id(id_curso)
    alumno = Alumno.get_by_id(id_alumno)
    if not curso:
        return jsonify({"error":"curso no encontrado"}), 404
    if not alumno:
        return jsonify({"error":"alumno no encontrado"}), 404

    asistencias = Asistencia.get_by_id_alumno_id_curso(id_curso,id_alumno)
    notas = Notas.get_by_id_alumno_id_curso(id_curso,id_alumno)

    nuevo = {
        "asistencias": render_asistencia_list(asistencias),
        "notas": render_nota_list(notas)
    }
    return jsonify(nuevo)


""" @nota_bp.route("/notas/<int:id_nota>/asistencias/<int:id_asistencia>", methods=["PUT"])
@jwt_required
@roles_required(rol=["profesor", "admin"])
def update_nota_asistencia(id_nota,id_asistencia): """
    