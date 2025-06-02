def render_matricula_list(matriculas):
    return [
        {
            "id_inscritos":matricula.id_inscritos,
            "id_alumno":matricula.id_alumno,
            "id_curso":matricula.id_curso,
            "fecha_inscripcion":matricula.fecha_inscripcion
        }
        for matricula in matriculas
    ]

def render_matricula(matricula):
    return {
            "id_inscritos":matricula.id_inscritos,
            "id_alumno":matricula.id_alumno,
            "id_curso":matricula.id_curso,
            "fecha_inscripcion":matricula.fecha_inscripcion
    }

def render_alumnos_curso(matriculas):
    return [
        {
            "id_alumno":matricula.id_alumno,
            "id_curso":matricula.id_curso,
        }
        for matricula in matriculas
    ]

def render_curso_list(cursos):
    return[
        {
            "id_curso":curso.id_curso,
            "id_profesor":curso.id_profesor,
            "nombre":curso.nombre,
            "descripcion":curso.descripcion,
            "nivel":curso.nivel,
            "anio_academico":curso.anio_academico
        }
        for curso in cursos
    ]