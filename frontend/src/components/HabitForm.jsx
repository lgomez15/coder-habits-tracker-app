import { useState } from 'react';
import api from '../services/api';
import './HabitForm.css';

const HabitForm = ({ habit, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: habit?.nombre || '',
        color: habit?.color || '#4CAF50'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const predefinedColors = [
        '#4CAF50', '#2196F3', '#FF5722', '#9C27B0',
        '#FF9800', '#E91E63', '#00BCD4', '#FFEB3B',
        '#795548', '#607D8B', '#F44336', '#3F51B5'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (habit) {
                // Update existing habit
                await api.put(`/habits/${habit._id}`, formData);
            } else {
                // Create new habit
                await api.post('/habits', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar hábito');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{habit ? 'Editar hábito' : 'Nuevo hábito'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">Nombre del hábito</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="form-input"
                            placeholder="Ej: Hacer ejercicio, Leer, Meditar..."
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Color</label>
                        <div className="color-picker">
                            {predefinedColors.map(color => (
                                <div
                                    key={color}
                                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData({ ...formData, color })}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            name="color"
                            className="color-input"
                            value={formData.color}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (habit ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitForm;
