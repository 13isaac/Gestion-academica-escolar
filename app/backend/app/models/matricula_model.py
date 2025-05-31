from app.database import db

class Matricula(db.Model):
    __tablename__ = "inscritos"
    id_inscritos = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey("alumnos.id_alumno", ondelete = "CASCADE"), nullable = False)
    id_curso = db.Column(db.Integer, db.ForeignKey("cursos.id_curso", ondelete = "CASCADE"), nullable = False)
    fecha_inscripcion = db.Column(db.Date, nullable = False)

    def __init__(self,id_alumno,id_curso,fecha_inscripcion):
        self.id_alumno = id_alumno
        self.id_curso = id_curso
        self.fecha_inscripcion = fecha_inscripcion
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Matricula.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Matricula.query.get(id)