# SSL/TLS Certificates

Este directorio contiene los certificados SSL/TLS necesarios para habilitar HTTPS en la aplicación.

## Archivos Requeridos

- `fullchain.pem` - Certificado SSL completo (incluye cadena de certificación)
- `privkey.pem` - Clave privada

## Para Desarrollo (Certificados Auto-firmados)

Para generar certificados auto-firmados para desarrollo local:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem -out fullchain.pem \
  -subj "/C=ES/ST=Madrid/L=Madrid/O=Development/CN=localhost"
```

**Nota**: Los navegadores mostrarán una advertencia de seguridad con certificados auto-firmados. Esto es normal en desarrollo.

## Para Producción

### Opción 1: Let's Encrypt (Recomendado)

1. Instala Certbot:
```bash
sudo apt-get install certbot
```

2. Genera certificados:
```bash
sudo certbot certonly --standalone -d tu-dominio.com
```

3. Copia los certificados a este directorio:
```bash
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem ./fullchain.pem
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem ./privkey.pem
sudo chmod 644 fullchain.pem
sudo chmod 600 privkey.pem
```

### Opción 2: Certificados Comerciales

Si tienes certificados de una autoridad certificadora comercial:

1. Coloca el certificado completo (incluyendo la cadena) en `fullchain.pem`
2. Coloca la clave privada en `privkey.pem`
3. Asegúrate de que los permisos sean correctos:
```bash
chmod 644 fullchain.pem
chmod 600 privkey.pem
```

## Seguridad

⚠️ **IMPORTANTE**:
- **NUNCA** subas estos archivos a Git
- El directorio `certs/` está en `.gitignore`
- Mantén la clave privada (`key.pem`) segura
- Usa permisos restrictivos: `chmod 600 key.pem`
- Renueva los certificados antes de que expiren

## Verificación

Para verificar que los certificados son válidos:

```bash
# Ver información del certificado
openssl x509 -in fullchain.pem -text -noout

# Verificar que la clave y el certificado coinciden
openssl x509 -noout -modulus -in fullchain.pem | openssl md5
openssl rsa -noout -modulus -in privkey.pem | openssl md5
# Los hashes MD5 deben ser idénticos
```

## Renovación Automática (Let's Encrypt)

Para configurar renovación automática con Let's Encrypt:

```bash
# Añadir a crontab
sudo crontab -e

# Añadir esta línea para renovar cada día a las 2:00 AM
0 2 * * * certbot renew --quiet && cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem /ruta/a/certs/fullchain.pem && cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem /ruta/a/certs/privkey.pem && docker-compose restart frontend
```
