import React, { useState, useEffect } from 'react';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import ToDoItem from './To-Do_Item';
import { useDialog } from './components/Dialog/DialogContext';
import { toast } from 'react-toastify';
import { hapticImpact, hapticNotification } from './hooks/useHaptics';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();
    const { ask } = useDialog();

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
            // Map _id to id for ToDoItem compatibility
            setTodos(res.data.map(item => ({...item, id: item._id})));
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
        if (!newTodo.trim()) {
            toast.error('Please enter a task.', {theme:'colored',position:'top-center'});
            return;
        }
        try {
            const res = await api.post('/add', { title: newTodo });
            const addedTodo = { ...res.data, id: res.data._id };
            setTodos([...todos, addedTodo]);
            setNewTodo('');
            hapticImpact('medium');
            toast.success('Task added!', {theme:'colored',position:'top-center'});
        } catch (err) {
            console.error("Error adding todo", err);
            toast.error('Failed to add task.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/delete/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error("Error deleting todo", err);
            toast.error('Failed to delete task.');
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await api.put(`/update/${id}`, { title: data });
            setTodos(todos.map(item => item.id === id ? { ...item, title: data } : item));
        } catch (err) {
            console.error(err);
            toast.error('Failed to update task.');
        }
    };

    const handleDone = async (id) => {
        try {
            await api.put(`/update/${id}`, { IsCompleted: true });
            setTodos(todos.map(item => item.id === id ? { ...item, IsCompleted: true } : item));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUndo = async (id) => {
        try {
            await api.put(`/update/${id}`, { IsCompleted: false });
            setTodos(todos.map(item => item.id === id ? { ...item, IsCompleted: false } : item));
        } catch (err) {
            console.error(err);
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
        <div className="home-container">
            <div className="home-header">
                <h1>My Tasks</h1>
                <Link to="/todos" className="view-all-link">Manage All Tasks →</Link>
            </div>
            
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

            <div className="todo-list-preview">
                {todos.length > 0 ? (
                    todos.slice(0, 5).map((todo, index) => (
                        <ToDoItem 
                            key={todo.id}
                            index={index + 1}
                            todo={todo}
                            Delete_From_List={handleDelete}
                            Update_List={handleUpdate}
                            Done={handleDone}
                            Undo={handleUndo}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No tasks yet. Add one to get started!</p>
                    </div>
                )}
            </div>

            {todos.length > 5 && (
                <div className="more-tasks-indicator">
                    <p>And {todos.length - 5} more tasks...</p>
                    <Link to="/todos" className="secondary-btn">View All Tasks</Link>
                </div>
            )}
        </div>
        </>
    );
};

export default Home;

