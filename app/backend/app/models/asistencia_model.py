from datetime import datetime
from app.database import db

class Asistencia(db.Model):
    __tablename__ = "asistencias"
    id_asistencia = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey("alumnos.id_alumno", ondelete = "CASCADE"), nullable = False)
    id_curso = db.Column(db.Integer, db.ForeignKey("cursos.id_curso", ondelete = "CASCADE"), nullable = False)
    fecha = db.Column(db.DateTime,default=datetime.now, nullable=False)
    sesion = db.Column(db.String(50), nullable = False)
    estado_asistencia = db.Column(db.Enum("Presente", "Ausente", "Justificado"), nullable=False, default="Presente")


    def __init__(self,id_alumno,id_curso, fecha, sesion, estado_asistencia):
        self.id_alumno = id_alumno
        self.id_curso = id_curso
        self.fecha = fecha
        self.sesion = sesion
        self.estado_asistencia = estado_asistencia
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Asistencia.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Asistencia.query.get(id)
    
    def update(self, id_alumno=None, id_curso=None, fecha=None, sesion=None, estado_asistencia=None):
        if id_alumno is not None:
            self.id_alumno = id_alumno
        if id_curso is not None:
            self.id_curso = id_curso
        if fecha is not None:
            self.fecha = fecha
        if sesion is not None:
            self.sesion = sesion
        if estado_asistencia is not None:
            self.estado_asistencia = estado_asistencia
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit  