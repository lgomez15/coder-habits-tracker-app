# 🎯 Habit Tracker

Una aplicación web completa para hacer seguimiento de hábitos diarios con visualización estilo "GitHub contributions graph".

![Habit Tracker](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Características

- 🔐 **Autenticación completa** - Registro e inicio de sesión con JWT
- 📊 **Visualización tipo GitHub** - Grid de 365 días con intensidad de color
- 🎨 **Colores personalizables** - Elige un color único para cada hábito
- 📈 **Seguimiento por clics** - Marca días completados con un simple clic
- 💪 **Intensidad progresiva** - El color se intensifica según repeticiones diarias
- 🌙 **Diseño moderno** - Tema oscuro con efectos glassmorphism
- 📱 **Responsive** - Funciona perfectamente en móviles y tablets

## 🏗️ Arquitectura

### Backend
- **Node.js + Express** - API RESTful
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación segura con tokens
- **bcryptjs** - Hash de contraseñas

### Frontend
- **React 18** - Librería UI moderna
- **Vite** - Build tool ultra-rápido
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP con interceptores
- **CSS Vanilla** - Diseño personalizado sin frameworks

### Estructura del Proyecto

```
tracker-habitos/
├── backend/
│   ├── models/
│   │   ├── User.js           # Modelo de usuario
│   │   ├── Habit.js          # Modelo de hábito
│   │   └── HabitRecord.js    # Modelo de registro diario
│   ├── routes/
│   │   ├── authRoutes.js     # Rutas de autenticación
│   │   └── habitRoutes.js    # Rutas de hábitos
│   ├── middleware/
│   │   └── authMiddleware.js # Middleware JWT
│   ├── server.js             # Servidor Express
│   ├── package.json
│   └── .env                  # Variables de entorno
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ContributionGrid.jsx  # Grid tipo GitHub
    │   │   ├── HabitCard.jsx         # Tarjeta de hábito
    │   │   ├── HabitForm.jsx         # Formulario crear/editar
    │   │   └── ProtectedRoute.jsx    # Ruta protegida
    │   ├── pages/
    │   │   ├── Login.jsx             # Página de login
    │   │   ├── Register.jsx          # Página de registro
    │   │   └── Dashboard.jsx         # Dashboard principal
    │   ├── services/
    │   │   └── api.js                # Cliente Axios
    │   ├── App.jsx                   # Componente raíz
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Estilos globales
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el repositorio

```bash
cd tracker-habitos
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
```

**Iniciar MongoDB** (si es local):

```bash
# macOS con Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Iniciar servidor backend**:

```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor estará en `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

**Iniciar servidor de desarrollo**:

```bash
npm run dev
```

El frontend estará en `http://localhost:3000`

### 4. Usar la aplicación

1. Abre `http://localhost:3000` en tu navegador
2. Regístrate con un nuevo usuario
3. Crea tu primer hábito con nombre y color
4. Haz clic en los cuadraditos para marcar días completados
5. ¡Observa cómo el color se intensifica con más repeticiones!

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar usuario | `{ nombre, email, password }` |
| POST | `/auth/login` | Iniciar sesión | `{ email, password }` |

### Hábitos (requieren autenticación)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/habits` | Listar hábitos del usuario | - |
| POST | `/habits` | Crear nuevo hábito | `{ nombre, color }` |
| PUT | `/habits/:id` | Actualizar hábito | `{ nombre?, color? }` |
| DELETE | `/habits/:id` | Eliminar hábito | - |
| POST | `/habits/:id/track` | Marcar día completado | `{ date: "YYYY-MM-DD" }` |
| GET | `/habits/:id/track?year=2025` | Obtener datos del año | - |

### Autenticación

Todas las rutas de hábitos requieren header:
```
Authorization: Bearer <jwt-token>
```

## 🎨 Lógica de Intensidad de Color

El sistema usa 5 niveles de intensidad (0-4):

| Nivel | Repeticiones | Opacidad |
|-------|--------------|----------|
| 0 | 0 (sin completar) | Gris oscuro |
| 1 | 1 vez | 25% |
| 2 | 2 veces | 50% |
| 3 | 3 veces | 75% |
| 4 | 4+ veces | 100% |

El color base se define al crear el hábito y se aplica con diferentes opacidades según las repeticiones.

## 🗄️ Modelos de Base de Datos

### User
```javascript
{
  nombre: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Habit
```javascript
{
  userId: ObjectId (ref: User),
  nombre: String,
  color: String (hex),
  timestamps: true
}
```

### HabitRecord
```javascript
{
  habitId: ObjectId (ref: Habit),
  fecha: Date,
  contador: Number (default: 1),
  timestamps: true
}
```

## 🛠️ Tecnologías Utilizadas

### Backend
- Express 4.18
- Mongoose 8.0
- jsonwebtoken 9.0
- bcryptjs 2.4
- cors 2.8
- dotenv 16.3

### Frontend
- React 18.2
- React Router DOM 6.20
- Axios 1.6
- Vite 5.0

## 🎯 Funcionalidades Futuras

- [ ] Estadísticas y gráficos de progreso
- [ ] Rachas (streaks) de días consecutivos
- [ ] Notificaciones y recordatorios
- [ ] Exportar datos a CSV/JSON
- [ ] Temas de color personalizables
- [ ] Compartir hábitos públicamente
- [ ] Modo offline con sincronización

## 📝 Notas de Desarrollo

### Decisiones de Diseño

1. **React con Vite**: Elegido por su velocidad y configuración mínima
2. **MongoDB**: Flexible para evolución del esquema de datos
3. **JWT en localStorage**: Simple para MVP, considerar httpOnly cookies en producción
4. **CSS Vanilla**: Control total sobre estilos sin dependencias pesadas

### Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración de 30 días
- Validación de entrada en backend
- CORS configurado para desarrollo

### Performance

- Índices en MongoDB para queries frecuentes
- Lazy loading de componentes (futuro)
- Memoización de cálculos de intensidad (futuro)

## 🐛 Troubleshooting

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
mongosh
# Si falla, iniciar el servicio
brew services start mongodb-community  # macOS
```

### Error de CORS

Verificar que el backend esté en puerto 5000 y el frontend en 3000. El proxy de Vite está configurado para esto.

### Token inválido

Limpiar localStorage y volver a iniciar sesión:
```javascript
localStorage.clear()
```

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para aprender o construir tu propia versión.

## 👨‍💻 Autor

Desarrollado como proyecto educativo para demostrar una aplicación MERN completa.

---

**¡Empieza a trackear tus hábitos hoy! 🚀**
