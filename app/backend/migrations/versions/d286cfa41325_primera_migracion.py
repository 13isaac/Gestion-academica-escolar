"""Primera migracion

Revision ID: d286cfa41325
Revises: 
Create Date: 2025-06-03 15:16:38.947992

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd286cfa41325'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('usuarios',
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('nombre_usuario', sa.String(length=50), nullable=False),
    sa.Column('contraseña', sa.String(length=256), nullable=False),
    sa.Column('rol', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id_usuario'),
    sa.UniqueConstraint('nombre_usuario')
    )
    op.create_table('alumnos',
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=50), nullable=False),
    sa.Column('apellido', sa.String(length=50), nullable=False),
    sa.Column('ci', sa.String(length=20), nullable=False),
    sa.Column('fecha_nacimiento', sa.Date(), nullable=False),
    sa.Column('correo', sa.String(length=120), nullable=False),
    sa.Column('estado', sa.Enum('Activo', 'Inactivo', name='estado_alumno'), nullable=False),
    sa.ForeignKeyConstraint(['id_usuario'], ['usuarios.id_usuario'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_alumno'),
    sa.UniqueConstraint('ci'),
    sa.UniqueConstraint('correo')
    )
    op.create_table('profesores',
    sa.Column('id_profesor', sa.Integer(), nullable=False),
    sa.Column('id_usuario', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=50), nullable=False),
    sa.Column('apellido', sa.String(length=50), nullable=False),
    sa.Column('correo', sa.String(length=100), nullable=False),
    sa.Column('especialidad', sa.String(length=50), nullable=True),
    sa.Column('estado', sa.Enum('Activo', 'Inactivo'), nullable=True),
    sa.ForeignKeyConstraint(['id_usuario'], ['usuarios.id_usuario'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_profesor'),
    sa.UniqueConstraint('correo')
    )
    op.create_table('cursos',
    sa.Column('id_curso', sa.Integer(), nullable=False),
    sa.Column('id_profesor', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=50), nullable=False),
    sa.Column('descripcion', sa.String(length=250), nullable=False),
    sa.Column('nivel', sa.Enum('Primaria', 'Secundaria'), nullable=False),
    sa.Column('anio_academico', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_profesor'], ['profesores.id_profesor'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_curso'),
    sa.UniqueConstraint('nombre')
    )
    op.create_table('asistencias',
    sa.Column('id_asistencia', sa.Integer(), nullable=False),
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('id_curso', sa.Integer(), nullable=False),
    sa.Column('fecha', sa.DateTime(), nullable=False),
    sa.Column('sesion', sa.String(length=50), nullable=False),
    sa.Column('estado_asistencia', sa.Enum('Presente', 'Ausente', 'Justificado'), nullable=False),
    sa.ForeignKeyConstraint(['id_alumno'], ['alumnos.id_alumno'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['id_curso'], ['cursos.id_curso'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_asistencia')
    )
    op.create_table('inscritos',
    sa.Column('id_inscritos', sa.Integer(), nullable=False),
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('id_curso', sa.Integer(), nullable=False),
    sa.Column('fecha_inscripcion', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['id_alumno'], ['alumnos.id_alumno'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['id_curso'], ['cursos.id_curso'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_inscritos')
    )
    op.create_table('notas',
    sa.Column('id_nota', sa.Integer(), nullable=False),
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('id_curso', sa.Integer(), nullable=False),
    sa.Column('evaluacion', sa.Enum('Parcial', 'Final', 'Trabajo'), nullable=True),
    sa.Column('tipo_evaluacion', sa.String(length=50), nullable=False),
    sa.Column('calificacion', sa.Float(), nullable=False),
    sa.Column('fecha', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['id_alumno'], ['alumnos.id_alumno'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['id_curso'], ['cursos.id_curso'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id_nota')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notas')
    op.drop_table('inscritos')
    op.drop_table('asistencias')
    op.drop_table('cursos')
    op.drop_table('profesores')
    op.drop_table('alumnos')
    op.drop_table('usuarios')
    # ### end Alembic commands ###
