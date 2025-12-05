import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="landing-container">
            {/* Header */}
            <header className="landing-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <span className="logo-icon">●</span>
                            <span className="logo-text">Habit Tracker</span>
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn-icon"
                                onClick={toggleTheme}
                                title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                            >
                                {theme === 'dark' ? '○' : '●'}
                            </button>
                            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
                                Iniciar Sesión
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Construye mejores hábitos,
                            <br />
                            <span className="gradient-text">un día a la vez</span>
                        </h1>
                        <p className="hero-subtitle">
                            Visualiza tu progreso con un sistema inspirado en GitHub.
                            Marca tus hábitos diarios y observa cómo tu constancia se transforma en resultados.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                                Comenzar Gratis
                            </button>
                            <button className="btn btn-lg" onClick={() => navigate('/login')}>
                                Ya tengo cuenta
                            </button>
                        </div>
                    </div>

                    {/* Visual Demo */}
                    <div className="hero-visual slide-in">
                        <div className="demo-card glass">
                            <div className="demo-header">
                                <div className="demo-habit-info">
                                    <div className="demo-color-dot" style={{ backgroundColor: '#3fb950' }}></div>
                                    <span>Ejercicio Diario</span>
                                </div>
                                <button className="btn btn-mark-today btn-sm">✓ Marcar Hoy</button>
                            </div>
                            <div className="demo-grid">
                                {Array.from({ length: 52 }).map((_, weekIndex) => (
                                    <div key={weekIndex} className="demo-week">
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            const intensity = Math.random();
                                            const opacity = intensity > 0.7 ? 1 : intensity > 0.5 ? 0.75 : intensity > 0.3 ? 0.5 : intensity > 0.1 ? 0.25 : 0;
                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className="demo-cell"
                                                    style={{
                                                        backgroundColor: opacity === 0 ? 'var(--empty-cell)' : `rgba(63, 185, 80, ${opacity})`
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">¿Cómo funciona?</h2>
                    <p className="section-subtitle">
                        Tres pasos simples para transformar tu vida
                    </p>

                    <div className="steps-grid">
                        <div className="step-card card fade-in">
                            <div className="step-number">1</div>
                            <div className="step-icon">📝</div>
                            <h3>Crea tus hábitos</h3>
                            <p>
                                Define los hábitos que quieres construir. Asigna un nombre y un color
                                personalizado para cada uno.
                            </p>
                        </div>

                        <div className="step-card card fade-in">
                            <div className="step-number">2</div>
                            <div className="step-icon">✓</div>
                            <h3>Marca tu progreso</h3>
                            <p>
                                Cada día, simplemente haz clic en "Marcar Hoy" cuando completes tu hábito.
                                Es así de fácil.
                            </p>
                        </div>

                        <div className="step-card card fade-in">
                            <div className="step-number">3</div>
                            <div className="step-icon">📊</div>
                            <h3>Visualiza tu constancia</h3>
                            <p>
                                Observa tu año completo de un vistazo. Los colores más intensos representan
                                mayor frecuencia y compromiso.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Características destacadas</h2>

                    <div className="features-grid">
                        <div className="feature-card glass">
                            <div className="feature-icon">🎨</div>
                            <h3>Personalización total</h3>
                            <p>Elige colores únicos para cada hábito y hazlos tuyos</p>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon">📈</div>
                            <h3>Visualización anual</h3>
                            <p>Ve todo tu año de progreso en una sola pantalla</p>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon">🌓</div>
                            <h3>Modo claro/oscuro</h3>
                            <p>Cambia entre temas según tu preferencia</p>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon">⚡</div>
                            <h3>Rápido y simple</h3>
                            <p>Un clic al día es todo lo que necesitas</p>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon">🔒</div>
                            <h3>Privado y seguro</h3>
                            <p>Tus datos están protegidos y son solo tuyos</p>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive</h3>
                            <p>Funciona perfectamente en todos tus dispositivos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content glass">
                        <h2>¿Listo para construir mejores hábitos?</h2>
                        <p>Únete hoy y comienza tu viaje hacia una vida más consistente y productiva</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                            Comenzar Ahora - Es Gratis
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>© 2024 Habit Tracker. Construye tu mejor versión.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
