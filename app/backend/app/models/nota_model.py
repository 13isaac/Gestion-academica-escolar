from app.database import db

class Notas(db.Model):
    __tablename__ = "notas"
    id_nota = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey("alumnos.id_alumno", ondelete = "CASCADE"), nullable = False)
    id_curso = db.Column(db.Integer, db.ForeignKey("cursos.id_curso", ondelete = "CASCADE"), nullable = False)
    evaluacion = db.Column(db.Enum("Parcial","Final","Trabajo"), default = "Trabajo")
    tipo_evaluacion = db.Column(db.String(50), nullable = False)
    calificacion = db.Column(db.Float, nullable=False) #validar
    fecha = db.Column(db.DateTime, nullable=False)

    def __init__(self,id_alumno,id_curso, evaluacion, tipo_evaluacion, calificacion, fecha):
        self.id_alumno = id_alumno
        self.id_curso = id_curso
        self.evaluacion = evaluacion
        self.tipo_evaluacion = tipo_evaluacion
        self.calificacion = calificacion
        self.fecha = fecha
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Notas.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Notas.query.get(id)
    
    def update(self, id_alumno=None, id_curso=None, evaluacion=None, tipo_evaluacion=None, calificacion=None, fecha=None):
        if id_alumno is not None:
            self.id_alumno = id_alumno
        if id_curso is not None:
            self.id_curso = id_curso
        if evaluacion is not None:
            self.evaluacion = evaluacion
        if tipo_evaluacion is not None:
            self.tipo_evaluacion = tipo_evaluacion
        if calificacion is not None:
            self.calificacion = calificacion
        if fecha is not None:
            self.fecha = fecha
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit
    @staticmethod
    def get_by_id_alumno_id_curso(id_curso, id_alumno):
        return Notas.query.filter_by(id_alumno=id_alumno, id_curso=id_curso).all()
    
    """ def nota_update_campos(self,evaluacion,nota): """