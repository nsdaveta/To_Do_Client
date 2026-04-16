import React, { useState, useEffect } from 'react'
import api from './api';
import { FaPencilAlt } from "react-icons/fa";
import './to-do.css';
import ToDoItem from './To-Do_Item';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { hapticImpact, hapticNotification } from './hooks/useHaptics';
import { useDialog } from './components/Dialog/DialogContext';
import { playSuccessSound, playClickSound, playDeleteSound, playCompleteAllSound, playClearAllSound } from './hooks/useSounds';

const To_Do = () => 
    {
        const [InputValue,setInputValue] = useState('');
        const [ToDoData,setToDoData] = useState([]);
        const navigate = useNavigate();
        const { ask } = useDialog();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            api.get('/')
            .then(result => {
                // Map _id to id for frontend compatibility
                setToDoData(result.data.map(item => ({...item, id: item._id})));
            })
            .catch(err => {
                console.log(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        }, [navigate])

        const Add_To_List = () =>
        {
            // prevent adding empty entries
            if (!InputValue.trim()) {
                toast.error('Please enter a task before adding.',{theme:'colored',position:'top-center',draggable:false});
                return;
            }
            api.post('/add', { title: InputValue })
            .then(result => {
                // Add the new item from server (with _id) to state
                const newTodo = { ...result.data, id: result.data._id };
                setToDoData([...ToDoData, newTodo]);
                hapticImpact('medium');
                playSuccessSound();
                toast.success('Task'+' ('+InputValue+') '+'Added To The To-Do List Successfully!!!',{theme:'colored',position:'top-center',draggable:false})
                setInputValue('');
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to add task.',{theme:'colored',position:'top-center',draggable:false});
            });
        }
        const Delete_From_List = (id)=>
        {
            api.delete(`/delete/${id}`)
            .then(result => {
                const NewToDoArray = ToDoData.filter(item => item.id !== id);
                setToDoData(NewToDoArray);
                playDeleteSound();
                toast.success('Task Deleted Successfully!!!',{theme:'colored',position:'top-center',draggable:false})
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to delete task.',{theme:'colored',position:'top-center',draggable:false});
            });
        }
        const Update_List = (id,data)=>
        {
            api.put(`/update/${id}`, { title: data })
            .then(result => {
                const NewToDoArray = ToDoData.map(item => item.id === id ? { ...item, title: data } : item);
                setToDoData(NewToDoArray);
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to update task.',{theme:'colored',position:'top-center',draggable:false});
            });
        }

        const Done = (id)=>
        {
            api.put(`/update/${id}`, { IsCompleted: true })
            .then(result => {
                const NewToDoArray = ToDoData.map(item => item.id === id ? { ...item, IsCompleted: true } : item);
                setToDoData(NewToDoArray);
            })
            .catch(err => console.log(err));
        }
        const Undo = (id)=>
        {
            api.put(`/update/${id}`, { IsCompleted: false })
            .then(result => {
                const NewToDoArray = ToDoData.map(item => item.id === id ? { ...item, IsCompleted: false } : item);
                setToDoData(NewToDoArray);
            })
            .catch(err => console.log(err));
        }
        const Clear_All = async () =>
        {
            // remove only completed tasks
            const completed = ToDoData.filter(t => t.IsCompleted);
            if (completed.length === 0) {
                toast.error('No completed tasks to clear.',{theme:'colored',position:'top-center',draggable:false});
                return;
            }

            const confirmed = await ask('Are you sure you want to clear all completed tasks?', {
                title: 'Clear Completed',
                kind: 'warning'
            });

            if (!confirmed) return;

            // Delete all completed tasks from server
            Promise.all(completed.map(t => api.delete(`/delete/${t.id}`)))
            .then(() => {
                const remaining = ToDoData.filter(t => !t.IsCompleted);
                setToDoData(remaining);
                hapticNotification('warning');
                playClearAllSound();
                toast.info('Completed tasks cleared.',{theme:'colored',position:'top-center',draggable:false});
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to clear some completed tasks.',{theme:'colored',position:'top-center',draggable:false});
            });
        }

        const Mark_All_Completed = async () => {
            // update all uncompleted tasks
            const uncompleted = ToDoData.filter(t => !t.IsCompleted);
            if (uncompleted.length === 0) {
                toast.info('All tasks are already completed.',{theme:'colored',position:'top-center',draggable:false});
                return;
            }

            const confirmed = await ask('Mark all remaining tasks as completed?', {
                title: 'Mark All Done',
                kind: 'info'
            });

            if (!confirmed) return;

            // Update all uncompleted tasks on server
            Promise.all(uncompleted.map(t => api.put(`/update/${t.id}`, { IsCompleted: true })))
            .then(() => {
                const updated = ToDoData.map(t => ({...t, IsCompleted: true}));
                setToDoData(updated);
                hapticNotification('success');
                playCompleteAllSound();
                toast.success('All tasks marked as completed!',{theme:'colored',position:'top-center',draggable:false});
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to update all tasks.',{theme:'colored',position:'top-center',draggable:false});
            });
        }
  return (
    <>
    <title>To Do App - Tasks</title>
    <div className="To_Do_Container">
        <div className="To-Do">
            <div className="todo-header">
                <h1>To-Do List</h1>
                <button className="logout-btn" onClick={async () => {
                    const confirmed = await ask('Are you sure you want to logout?', {
                        title: 'Logout',
                        kind: 'info'
                    });
                    if (confirmed) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                }}>Logout</button>
            </div>

            {ToDoData && ToDoData.length > 0 && (
                <div className="todo-progress-container">
                    <div 
                        className={`todo-progress-bar ${ToDoData.filter(t => t.IsCompleted).length === ToDoData.length ? 'full' : ''}`} 
                        style={{ 
                            width: `${(ToDoData.filter(t => t.IsCompleted).length / ToDoData.length) * 100}%` 
                        }}
                    />
                </div>
            )}

            <form className="input-form" onSubmit={(e)=>{e.preventDefault();Add_To_List();}}>
                <input value={InputValue} onChange={(e)=>setInputValue(e.target.value)} type='text' placeholder='What needs to be done?'/>
                <button type="submit" className="add-task-btn">Add Task <FaPencilAlt size={13} /></button>
            </form>
            <div className="todo-list-items">
                {
                    // guard against null and render each item cleanly
                    ToDoData && ToDoData.map((todo, index) => (
                        <ToDoItem
                            key={todo.id}
                            index={index + 1}
                            todo={todo}
                            Delete_From_List={Delete_From_List}
                            Update_List={Update_List}
                            Done={Done}
                            Undo={Undo}
                        />
                    ))
                }
            </div>
            {ToDoData && ToDoData.length > 0 && (
                <div className="clear-btn-container">
                    <button className="action-btn mark-all-btn" onClick={Mark_All_Completed}>Mark All Completed</button>
                    <button className="action-btn clear-all-btn" onClick={Clear_All}>Clear Completed</button>
                </div>
            )}
        </div>
    </div>
    </>          
  )
}
export default To_Do;
