import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await api.get('/habits');
            setHabits(response.data.habits);
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleCreateHabit = () => {
        setEditingHabit(null);
        setShowForm(true);
    };

    const handleEditHabit = (habit) => {
        setEditingHabit(habit);
        setShowForm(true);
    };

    const handleDeleteHabit = (habitId) => {
        setHabits(habits.filter(h => h._id !== habitId));
    };

    const handleFormSuccess = () => {
        fetchHabits();
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content container">
                    <div className="header-left">
                        <div className="logo">
                            <span className="logo-icon">●</span>
                            <span className="logo-text">Habit Tracker</span>
                        </div>
                        {user && <p className="welcome-text">Hola, {user.nombre}</p>}
                    </div>
                    <div className="header-right">
                        <button className="btn btn-primary" onClick={handleCreateHabit}>
                            + Nuevo hábito
                        </button>
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                        <button
                            className="btn-icon"
                            onClick={toggleTheme}
                            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                        >
                            {theme === 'dark' ? '○' : '●'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main container">
                {habits.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h2>No tienes hábitos todavía</h2>
                        <p className="text-secondary">
                            Crea tu primer hábito para comenzar a hacer seguimiento
                        </p>
                        <button className="btn btn-primary mt-lg" onClick={handleCreateHabit}>
                            Crear mi primer hábito
                        </button>
                    </div>
                ) : (
                    <div className="habits-list">
                        {habits.map(habit => (
                            <HabitCard
                                key={habit._id}
                                habit={habit}
                                onEdit={handleEditHabit}
                                onDelete={handleDeleteHabit}
                                onUpdate={fetchHabits}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showForm && (
                <HabitForm
                    habit={editingHabit}
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default Dashboard;
