from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required, roles_required

from app.models.matricula_model import Matricula
from app.models.curso_model import Curso
from app.models.alumno_model import Alumno
from app.models.profesor_model import Profesor
from app.models.usuario_model import Usuario
from app.views.matricula_view import render_matricula, render_matricula_list, render_alumnos_curso,render_curso_list


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

@matricula_bp.route("cursos/<int:id>/alumnos", methods=["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor"])
def get_alumnos_por_curso(id):
    curso = Curso.get_by_id(id)
    if curso:
        matriculas_curso = Matricula.get_by_id_curso(id)
        return jsonify(render_alumnos_curso(matriculas_curso))
    return jsonify({"error":"Curso no encontrado"}), 401

@matricula_bp.route("cursos/por/alumnos/<string:nom_user>")
@jwt_required
@roles_required(rol = ["admin","profesor","user"])
def get_alumnos_curso(nom_user):
    usuario = Usuario.find_by_username(nom_user)
    if not usuario:
        return jsonify({"error":"Alumno no encontrado"})
    
    id_usuario = usuario.id_usuario

    alumno = Alumno.get_by_id_user(id_usuario)

    if not alumno:
        return jsonify({"error":"Alumno no encontrado"})
    id_alumno = alumno.id_alumno    
    respuesta = Matricula.get_by_id_alumno(id_alumno)
    cursosID = render_alumnos_curso(respuesta)
    cursos = []

    for curso in cursosID:
        cursos.append(Curso.get_by_id(curso["id_curso"]))
    
    return jsonify(render_curso_list(cursos))

