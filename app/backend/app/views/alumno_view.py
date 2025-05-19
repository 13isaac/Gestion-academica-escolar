def render_alumno_list(alumnos):
    return [
        {
            "id_alumno": alumno.id_alumno,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "ci": alumno.ci,
            "fecha_nacimiento": alumno.fecha_nacimiento,
            "correo": alumno.correo,
            "estado": alumno.estado
        }
        for alumno in alumnos
    ]
