import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDialog } from './Dialog/DialogContext';
import './navbar.css';

const Navbar = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const navigate = useNavigate();
    const { ask } = useDialog();

    useEffect(() => { 
        const handleAuthChange = () => {
            setToken(localStorage.getItem('token'));
            setUsername(localStorage.getItem('username'));
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const handleLogout = async () => {
        const confirmed = await ask('Are you sure you want to logout?', {
            title: 'Logout',
            kind: 'info'
        });
        
        if (!confirmed) return;

        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div>
                <NavLink to="/" className="nav-brand">
                    TODO<span>APP</span>
                </NavLink>
            </div>
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
                {token ? (
                    <>
                        <NavLink to="/todos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Tasks</NavLink>
                        <div className="user-info">
                            <span className="user-label">Logged in as</span>
                            <span className="user-email">{username || 'User'}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Login</NavLink>
                        <NavLink to="/register" className="login-btn">Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
