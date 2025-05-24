def render_profesor_list(profesores):
    return[
        {
            "id_profesor":profesor.id_profesor,
            "id_usuario":profesor.id_usuario,
            "nombre":profesor.nombre,
            "apellido":profesor.apellido,
            "correo":profesor.correo,
            "especialidad":profesor.especialidad,
            "estado":profesor.estado
        }
        for profesor in profesores
    ]

def render_profesor(profesor):
    return {
        "id_profesor":profesor.id_profesor,
        "id_usuario":profesor.id_usuario,
        "nombre":profesor.nombre,
        "apellido":profesor.apellido,
        "correo":profesor.correo,
        "especialidad":profesor.especialidad,
        "estado":profesor.estado
    }