from flask_jwt_extended import get_jwt_identity
import requests,json

from flask import Blueprint, jsonify

from ..models.usuario_model import Usuario

from ..models.asistencia_model import Asistencia
from ..models.curso_model import Curso
from ..models.nota_model import Notas
from ..models.profesor_model import Profesor
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

@alumno_bp.route("/alumnos/curso/<int:id>", methods=["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor"])
def get_alumnos_por_curso(id):
    get_response = requests.request(method="GET", url=f'http://127.0.0.1:5000/api/cursos/{id}/alumnos')
    response = get_response.json()
    alumnos = []
    for alumno in response:
        alumnos.append(Alumno.get_by_id(alumno["id_alumno"]))
    
    return jsonify(render_alumno_list(alumnos))
    
@alumno_bp.route('/alumnos/curso/<int:id_curso>/detalle', methods=['GET'])
@jwt_required
def detalle_curso(id_curso):
    identidad = get_jwt_identity()
    nombre_usuario = identidad.get("nombre_usuario")

    if not nombre_usuario:
        return jsonify({"error": "Token inválido o falta nombre_usuario"}), 401

    # Buscar usuario completo para obtener id_usuario
    usuario = Usuario.find_by_username(nombre_usuario)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    id_usuario = usuario.id_usuario  # Ahora sí tienes el id_usuario

    alumno = Alumno.query.filter_by(id_usuario=id_usuario).first()
    if not alumno:
        return jsonify({"error": "El usuario no está registrado como alumno"}), 403

    # Sigue el resto igual
    curso = Curso.query.filter_by(id_curso=id_curso).first()
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404

    profesor = Profesor.query.filter_by(id_profesor=curso.id_profesor).first()

    notas = Notas.query.filter_by(id_alumno=alumno.id_alumno, id_curso=id_curso).all()
    notas_serializadas = [
        {
            "evaluacion": nota.evaluacion,
            "tipo_evaluacion": nota.tipo_evaluacion,
            "calificacion": nota.calificacion,
            "fecha": nota.fecha.strftime("%Y-%m-%d")
        } for nota in notas
    ]

    asistencias = Asistencia.query.filter_by(id_alumno=alumno.id_alumno, id_curso=id_curso).all()
    total = len(asistencias)
    presentes = sum(1 for a in asistencias if a.estado_asistencia == "Presente")
    porcentaje_asistencia = (presentes / total) * 100 if total > 0 else 0

    return jsonify({
        "alumno": {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "correo": alumno.correo
        },
        "curso": {
            "nombre": curso.nombre,
            "descripcion": curso.descripcion,
            "nivel": curso.nivel,
            "anio_academico": curso.anio_academico
        },
        "profesor": {
            "nombre": profesor.nombre,
            "apellido": profesor.apellido,
            "correo": profesor.correo
        },
        "notas": notas_serializadas,
        "porcentaje_asistencia": round(porcentaje_asistencia, 2)
    })