# 🐳 Docker Setup - Habit Tracker

Esta guía te ayudará a ejecutar toda la aplicación usando Docker.

## 📋 Prerequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (copia desde `.env.example`):

```bash
cp .env.example .env
```

**IMPORTANTE**: Cambia el `JWT_SECRET` en el archivo `.env` por un valor seguro en producción.

### 2. Configurar certificados SSL (HTTPS)

Los certificados auto-firmados ya están generados en la carpeta `certs/`. Para regenerarlos o usar certificados de producción, consulta `certs/README.md`.

Para generar nuevos certificados auto-firmados:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/privkey.pem -out certs/fullchain.pem \
  -subj "/C=ES/ST=Madrid/L=Madrid/O=Development/CN=localhost"
```

### 3. Construir y ejecutar los servicios

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f
```

### 4. Acceder a la aplicación

- **Frontend (HTTPS)**: https://localhost:3443 ⭐ **Recomendado**
- **Frontend (HTTP)**: http://localhost:3000 (redirige a HTTPS)
- **Backend API**: http://localhost:5002
- **MongoDB**: localhost:5069

**Nota**: Al usar certificados auto-firmados, tu navegador mostrará una advertencia de seguridad. Esto es normal en desarrollo. Acepta la advertencia para continuar.

## 🛠️ Comandos Útiles

### Ver estado de los contenedores
```bash
docker-compose ps
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Detener los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ BORRA TODOS LOS DATOS)
```bash
docker-compose down -v
```

### Reconstruir un servicio específico
```bash
docker-compose build backend
docker-compose up -d backend
```

### Ejecutar comandos dentro de un contenedor
```bash
# Acceder al shell del backend
docker-compose exec backend sh

# Acceder al shell de MongoDB
docker-compose exec mongodb mongosh
```

## 🏗️ Arquitectura

La aplicación está compuesta por 3 servicios:

1. **Frontend** (Puertos 3000 HTTP, 3443 HTTPS)
   - React + Vite
   - Servido por Nginx con SSL/TLS
   - Proxy reverso al backend
   - Redirección automática HTTP → HTTPS

2. **Backend** (Puerto 5000)
   - Node.js + Express
   - API REST
   - Autenticación JWT

3. **MongoDB** (Puerto 5069)
   - Base de datos
   - Persistencia con volúmenes Docker

## 🔧 Desarrollo

Para desarrollo local sin Docker, consulta el README principal del proyecto.

### Reconstruir después de cambios en el código

```bash
# Reconstruir y reiniciar
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Los contenedores no inician
```bash
# Ver logs detallados
docker-compose logs

# Verificar que los puertos no estén en uso
lsof -i :3000
lsof -i :5000
lsof -i :5069
```

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté saludable
docker-compose ps

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Limpiar todo y empezar de cero
```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes huérfanas
docker system prune -f

# Reconstruir todo
docker-compose build --no-cache
docker-compose up -d
```

## 📦 Producción

Para producción, considera:

1. Cambiar `JWT_SECRET` a un valor seguro y único
2. Usar variables de entorno seguras
3. Configurar HTTPS con un reverse proxy (nginx, traefik, etc.)
4. Implementar backups regulares del volumen de MongoDB
5. Configurar límites de recursos para los contenedores
6. Usar Docker secrets para información sensible

## 🔐 Seguridad

- ✅ Las imágenes usan usuarios no-root
- ✅ Healthchecks configurados para todos los servicios
- ✅ Red aislada para comunicación entre servicios
- ✅ Headers de seguridad en Nginx (HSTS, X-Frame-Options, etc.)
- ✅ HTTPS configurado con SSL/TLS
- ✅ Redirección automática HTTP → HTTPS
- ⚠️ Cambiar JWT_SECRET en producción
- ⚠️ Reemplazar certificados auto-firmados con certificados de producción (Let's Encrypt)
- ⚠️ Verificar puertos 3000 y 3443 no estén en uso

## 🔒 Certificados SSL

Los certificados se almacenan en la carpeta `certs/`:
- `fullchain.pem` - Certificado SSL completo (incluye cadena de certificación)
- `privkey.pem` - Clave privada

Para más información sobre certificados, consulta `certs/README.md`.
