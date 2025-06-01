def render_matricula_list(matriculas):
    return [
        {
            "id_inscritos":matricula.id_inscritoss,
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