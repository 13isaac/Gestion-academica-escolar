def render_curso_list(cursos):
    return [
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

def render_curso(curso):
    return {
        "id_curso":curso.id_curso,
        "id_profesor":curso.id_profesor,
        "nombre":curso.nombre,
        "descripcion":curso.descripcion,
        "nivel":curso.nivel,
        "anio_academico":curso.anio_academico
    }

def render_cursos_profesores(lista):
    return [
        {
            "id_profesor":matricula.id_profesor,
            "id_curso":matricula.id_curso,
        }
        for matricula in lista
    ]