def render_nota_list(notas):
    return [
        {
            "id_nota":nota.id_nota,
            "id_alumno":nota.id_alumno,
            "id_curso":nota.id_curso,
            "evaluacion":nota.evaluacion,
            "tipo_evaluacion":nota.tipo_evaluacion,
            "calificacion":nota.calificacion,
            "fecha": nota.fecha.strftime('%Y-%m-%d'),
        }
        for nota in notas
    ]

def render_nota_detail(nota):
    return {
        "id_nota":nota.id_nota,
        "id_alumno":nota.id_alumno,
        "id_curso":nota.id_curso,
        "evaluacion":nota.evaluacion,
        "tipo_evaluacion":nota.tipo_evaluacion,
        "calificacion":nota.calificacion,
        "fecha": nota.fecha.strftime('%Y-%m-%d'),
    }