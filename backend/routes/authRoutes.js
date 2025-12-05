import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// POST /auth/register - Register new user
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validate input
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Por favor proporciona nombre, email y contraseña'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Create user
        const user = new User({ nombre, email, password });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error al registrar usuario',
            details: error.message
        });
    }
});

// POST /auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Por favor proporciona email y contraseña'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión',
            details: error.message
        });
    }
});

export default router;
