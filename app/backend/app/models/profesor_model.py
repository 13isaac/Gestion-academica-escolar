from app.database import db

class Profesor(db.Model):
    __tablename__ = "profesores"

    id_profesor = db.Column(db.Integer, primary_key = True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuarios.id_usuario", ondelete = "CASCADE"), nullable = False)
    nombre = db.Column(db.String(50), nullable = False)
    apellido = db.Column(db.String(50), nullable = False)
    correo = db.Column(db.String(100), unique = True, nullable = False)
    especialidad = db.Column(db.String(50))
    estado = db.Column(db.Enum("activo","inactivo"), default = "activo")

    usuario = db.relationship('Usuario', backref='profesor')

    def __init__(self,id_usuario,nombre,apellido,correo,especialidad,estado):
        self.id_usuario = id_usuario
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.especialidad = especialidad
        self.estado = estado

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Profesor.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Profesor.query.get(id)
    
    @staticmethod
    def get_by_id_user(id_usuario):
        return Alumno.query.filter_by(id_usuario=id_usuario).first()