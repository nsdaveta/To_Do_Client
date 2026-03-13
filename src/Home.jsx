import React, { useState, useEffect } from 'react';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthChange = () => {
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    useEffect(() => {
        if (token) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [token]);

    const fetchTodos = async () => {
        try {
            const res = await api.get('/');
            setTodos(res.data);
        } catch (err) {
            console.error("Error fetching todos", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('authChange'));
                navigate('/login');
            }
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            const res = await api.post('/add', { title: newTodo });
            setTodos([...todos, res.data]);
            setNewTodo('');
        } catch (err) {
            console.error("Error adding todo", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/delete/${id}`);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error("Error deleting todo", err);
        }
    };

    const handleToggleComplete = async (id, isCompleted) => {
        try {
            const res = await api.put(`/update/${id}`, { IsCompleted: !isCompleted });
            setTodos(todos.map(t => t._id === id ? res.data : t));
        } catch (err) {
            console.error("Error updating todo", err);
        }
    };

    if (!token) {
        return (
            <>
            <title>To Do App - Home</title>
            <div className="home-landing">
                <h1>Organize Your Life</h1>
                <p>A simple, elegant way to keep track of your daily tasks and boost your productivity.</p>
                <div className="landing-actions">
                    <Link to="/login" className="primary-btn" style={{ padding: '14px 40px', borderRadius: '12px' }}>Get Started</Link>
                    <Link to="/register" className="secondary-btn" style={{ padding: '14px 40px', borderRadius: '12px' }}>Create Account</Link>
                </div>
            </div>
            </>
        );
    }

    return (
        <>
        <title>To Do App - Home</title>
        <div className="home-container glass-card">
            <h1>My Tasks</h1>
            <form onSubmit={handleAddTodo} className="todo-form">
                <input 
                    type="text" 
                    value={newTodo} 
                    onChange={(e) => setNewTodo(e.target.value)} 
                    placeholder="What needs to be done?" 
                    className="todo-input"
                />
                <button type="submit" className="add-btn">Add Task</button>
            </form>
            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={todo._id} className={`todo-item ${todo.IsCompleted ? 'completed' : ''}`}>
                        <div className="todo-content">
                            <span className="todo-index">{index + 1}.</span>
                            <input 
                                type="checkbox" 
                                checked={todo.IsCompleted} 
                                onChange={() => handleToggleComplete(todo._id, todo.IsCompleted)}
                                className="todo-checkbox"
                            />
                            <span className={`todo-text ${todo.IsCompleted ? 'completed' : ''}`}>
                                {todo.title}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(todo._id)} className="delete-task-btn">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {todos.length === 0 && (
                <div className="empty-state">
                    <p>No tasks yet. Add one to get started!</p>
                </div>
            )}
        </div>
        </>
    );
};

export default Home;
