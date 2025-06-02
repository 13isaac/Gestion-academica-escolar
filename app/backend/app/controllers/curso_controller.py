from flask import Blueprint, jsonify

from app.utils.decorators import jwt_required, roles_required

from app.models.curso_model import Curso
from app.models.profesor_model import Profesor
from app.models.usuario_model import Usuario
from app.views.curso_view import render_curso, render_curso_list, render_cursos_profesores

curso_bp = Blueprint("curso", __name__)

@curso_bp.route("/cursos", methods=["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor", "user"])
def get_cursos():
    cursos = Curso.get_all()
    return jsonify(render_curso_list(cursos))

@curso_bp.route("/cursos/<int:id>", methods=["GET"])
@jwt_required
@roles_required(rol = ["admin","profesor","user"])
def get_curso(id):
    curso = Curso.get_by_id(id)
    if curso:
        return jsonify(render_curso(curso))
    return jsonify({"message": "Curso no encontrado"}), 401


@curso_bp.route("cursos/por/profesores/<string:nom_user>")
@jwt_required
@roles_required(rol = ["admin","profesor","user"])
def get_alumnos_curso(nom_user):
    usuario = Usuario.find_by_username(nom_user)
    if not usuario:
        return jsonify({"error":"Usuario no encontrado"})
    id_usuario = usuario.id_usuario

    profesor = Profesor.get_by_id_user(id_usuario)

    if not profesor:
        return jsonify({"error":"Profesor no encontrado"})
    id_profesor = profesor.id_profesor    
    respuesta = Curso.get_by_id_profesor(id_profesor)
    cursosID = render_cursos_profesores(respuesta)
    cursos = []

    for curso in cursosID:
        cursos.append(Curso.get_by_id(curso["id_curso"]))
    
    return jsonify(render_curso_list(cursos))