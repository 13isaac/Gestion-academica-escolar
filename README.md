# 🗃️ Gestión Académica Escolar – Migraciones y Flujo de Trabajo con la Base de Datos

Este proyecto utiliza **Flask-Migrate** y **MariaDB** para gestionar cambios en el esquema de base de datos de manera colaborativa. A continuación se detallan los pasos recomendados para trabajar correctamente con las migraciones y mantener sincronizado el entorno de desarrollo entre colaboradores.

---

## 🔄 Flujo de trabajo para cambios en la BD

### 🧱 Primera configuración (inicial)

Ejecuta las migraciones iniciales:

```bash
flask db init
flask db migrate -m "Esquema inicial"
flask db upgrade

Verifica las tablas creadas en MariaDB:
mysql -u ga_admin -p -e "USE gestion_academica; SHOW TABLES;"

✏️ Cuando hagas cambios en los modelos (por ejemplo, estudiante_model.py)
Genera una nueva migración:

bash
Copiar código
flask db migrate -m "Descripción del cambio"
# Ejemplo:
flask db migrate -m "Añadir campo email a Alumnos"
Aplica los cambios:

bash
Copiar código
flask db upgrade
Verifica los cambios en la base de datos:

bash
Copiar código
mysql -u ga_admin -p -e "USE gestion_academica; DESCRIBE Alumnos;"
👥 Pasos para el otro desarrollador (para sincronizar tus cambios)
Obtener los últimos cambios del repositorio:

bash
Copiar código
git pull origin main
Instalar dependencias (si hay cambios):

bash
Copiar código
pip install -r requirements.txt
Aplicar las migraciones en su base local:

bash
Copiar código
flask db upgrade
Verificar el estado de las migraciones aplicadas:

bash
Copiar código
flask db current
📌 Consejos clave para colaboración
Sobre migraciones:
✅ Siempre incluye los archivos dentro de migrations/versions/ en tus commits.

🚫 Nunca edites manualmente archivos de migración ya existentes.

⚠️ Si hay conflictos (por ejemplo, ambos modificaron modelos):

bash
Copiar código
# 1. Borra la migración conflictiva local
rm migrations/versions/1234_xxx.py

# 2. Regenera y aplica migraciones
flask db migrate -m "Nuevos cambios combinados"
flask db upgrade
🔁 Reiniciar completamente (en desarrollo o pruebas)
bash
Copiar código
# 1. Elimina la base de datos y las migraciones
mysql -u root -p -e "DROP DATABASE gestion_academica; CREATE DATABASE gestion_academica;"
rm -rf migrations/

# 2. Vuelve a inicializar todo
flask db init
flask db migrate
flask db upgrade
🔍 Verificación visual de cambios
Puedes usar herramientas gráficas como:

DBeaver

HeidiSQL

Para conectarte a MariaDB, revisar la estructura de las tablas y examinar datos de prueba.

📋 Checklist para cada cambio
 Modelos de Python actualizados

 Nueva migración generada (flask db migrate)

 Migración aplicada (flask db upgrade)

 Archivos de migración agregados y commiteados

 README actualizado si es necesario

🧪 Ejemplo de flujo completo
bash
Copiar código
# 1. Modificas estudiante_model.py
flask db migrate -m "Añadir columna 'activo' a Alumnos"

# 2. Aplicas cambios
flask db upgrade

# 3. Commit de migración
git add migrations/versions/2023_xxx_añadir_activo.py
git commit -m "db: Añadir campo activo a estudiantes"
git push
El otro desarrollador solo necesita hacer:
bash
Copiar código
git pull
flask db upgrade
