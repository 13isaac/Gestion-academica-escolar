from app.database import db

class Curso(db.Model):
    __tablename__ = "cursos"
    id_curso = db.Column(db.Integer, primary_key=True)
    id_profesor = db.Column(db.Integer, db.ForeignKey("profesores.id_profesor", ondelete = "CASCADE"), nullable = False)
    nombre = db.Column(db.String(50), unique = True, nullable = False)
    descripcion = db.Column(db.String(250), nullable = False)
    nivel = db.Column(db.Enum("Primaria", "Secundaria"), nullable=False, default="Primaria")
    anio_academico = db.Column(db.Integer, nullable = False)

    def __init__(self, id_profesor, nombre, descripcion, nivel, anio_academico):
        self.id_profesor = id_profesor
        self.nombre = nombre
        self.descripcion = descripcion
        self.nivel = nivel
        self.anio_academico = anio_academico
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Curso.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Curso.query.get(id)