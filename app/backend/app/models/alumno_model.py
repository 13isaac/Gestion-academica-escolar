from app.database import db

class Alumno(db.Model):
    __tablename__ = "alumnos"
    id_alumno = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuarios.id_usuario", ondelete = "CASCADE"), nullable = False)
    nombre = db.Column(db.String(50), nullable = False)
    apellido = db.Column(db.String(50), nullable = False)
    ci = db.Column(db.String(20), nullable=False, unique=True)
    fecha_nacimiento = db.Column(db.Date, nullable = False)
    correo = db.Column(db.String(120), nullable = False, unique = True)
    estado = db.Column(db.Enum("Activo", "Inactivo", name="estado_alumno"), nullable=False, default="Activo")

    def __init__(self,id_usuario,nombre,apellido,ci,fecha_nacimiento,correo,estado):
        self.id_usuario = id_usuario
        self.nombre = nombre
        self.apellido = apellido
        self.ci = ci
        self.fecha_nacimiento = fecha_nacimiento
        self.correo = correo
        self.estado = estado
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Alumno.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Alumno.query.get(id)
    
    @staticmethod
    def get_by_id_user(id_usuario):
        return Alumno.query.filter_by(id_usuario=id_usuario).first()