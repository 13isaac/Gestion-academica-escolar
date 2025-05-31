def render_asistencia_list(asistencias):
    return [
        {
            "id_asistencia":asistencia.id_asistencia,
            "id_alumno":asistencia.id_alumno,
            "id_curso":asistencia.id_curso,
            "fecha":asistencia.fecha.strftime('%Y-%m-%dT%H:%M:%S'),
            "sesion":asistencia.sesion,
            "estado_asistencia":asistencia.estado_asistencia
        }
        for asistencia in asistencias
    ]

def render_asistencia_detail(asistencia):
    return {
        "id_asistencia":asistencia.id_asistencia,
        "id_alumno":asistencia.id_alumno,
        "id_curso":asistencia.id_curso,
        "fecha":asistencia.fecha.strftime('%Y-%m-%dT%H:%M:%S'),
        "sesion":asistencia.sesion,
        "estado_asistencia":asistencia.estado_asistencia
    }