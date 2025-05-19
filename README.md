# 🗃️ Gestión Académica Escolar – Migraciones y Flujo de Trabajo con la Base de Datos

Este proyecto utiliza **Flask-Migrate** y **MariaDB** para gestionar cambios en el esquema de base de datos de manera colaborativa. A continuación se detallan los pasos recomendados para trabajar correctamente con las migraciones y mantener sincronizado el entorno de desarrollo entre colaboradores.

---

## 🔄 Flujo de trabajo para cambios en la BD

### 🧱 Primera configuración (inicial)
- Crea la base de datos y tu usuario otorgando todos los permisos sobre esta
```bash
CREATE DATABASE gestion_academica;
CREATE USER 'ga_admin'@'localhost' IDENTIFIED BY 'Gestion123!';
GRANT ALL PRIVILEGES ON gestion_academica.* TO 'ga_admin'@'localhost';
FLUSH PRIVILEGES;
```

- Ejecuta las migraciones iniciales (desde: Gestion-academica-escolar/app/backend):

```bash
pip install -r requirements.txt
flask db upgrade
```

- Verifica las tablas creadas en MariaDB:
```bash
mysql -u ga_admin -p -e "USE gestion_academica; SHOW TABLES;"
```

### ✏️ Cuando hagas cambios en los modelos (por ejemplo, estudiante_model.py)
- Genera una nueva migración (desde: Gestion-academica-escolar/app/backend):

bash
```bash
flask db migrate -m "Descripción del cambio"
# Ejemplo:
flask db migrate -m "Añadir campo email a Alumnos"
```

- Aplica los cambios:

```bash
flask db upgrade
```

- Verifica los cambios en la base de datos:

```bash
mysql -u ga_admin -p -e "USE gestion_academica; DESCRIBE Alumnos;"
```

### 👥 Sincronizar tus cambios con migo o visceversa

- Obtener los últimos cambios del repositorio:
```bash
git pull origin main
```
- Instalar dependencias (si hay cambios):
```bash
pip install -r requirements.txt
```

- Aplicar las migraciones en su base local:
```bash
flask db upgrade
```

### 📋 Checklist para cada cambio
 - Modelos de Python actualizados
 - Nueva migración generada (flask db migrate)
 - Migración aplicada (flask db upgrade)
 - Archivos de migración agregados y commiteados
 
### 🧪 Ejemplo de flujo completo
```bash
# 1. Modificas estudiante_model.py
flask db migrate -m "Añadir columna 'activo' a Alumnos"

# 2. Aplicas cambios
flask db upgrade

# 3. Commit de migración
git add migrations/versions/2023_xxx_añadir_activo.py
git commit -m "db: Añadir campo activo a estudiantes"
git push
```

- El otro desarrollador solo necesita hacer:
```bash
git pull
flask db upgrade
```
# Levantar tanto el frontend como el backend
## Frontend Setup
1. Instalar Node.js v18.x o superior:
   - [Download Node.js](https://nodejs.org/)

2. Configurar el proyecto:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
## Para levantar el backend en una termianl ejecutar lo siguiente (desde: Gestion-academica-escolar/app/backend)
```bash
python3 run.py
```
## Para levantar el frontend en una terminal nueva sin cerrar o tumbar el anterior servicio (desde: Gestion-academica-escolar/app/frontend)
```bash
npm run dev
```
