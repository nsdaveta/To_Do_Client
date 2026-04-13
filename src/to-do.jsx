import React, { useState, useEffect } from 'react'
import api from './api';
import { FaPencilAlt } from "react-icons/fa";
import './to-do.css';
import ToDoItem from './To-Do_Item';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { hapticImpact, hapticNotification } from './hooks/useHaptics';

const To_Do = () => 
    {
        const [InputValue,setInputValue] = useState('');
        const [ToDoData,setToDoData] = useState([]);
        const navigate = useNavigate();

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
        const Clear_All = () =>
        {
            // remove only completed tasks
            const completed = ToDoData.filter(t => t.IsCompleted);
            if (completed.length === 0) {
                toast.error('No completed tasks to clear.',{theme:'colored',position:'top-center',draggable:false});
                return;
            }
            // Delete all completed tasks from server
            Promise.all(completed.map(t => api.delete(`/delete/${t.id}`)))
            .then(() => {
                const remaining = ToDoData.filter(t => !t.IsCompleted);
                setToDoData(remaining);
                hapticNotification('warning');
                toast.info('Completed tasks cleared.',{theme:'colored',position:'top-center',draggable:false});
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to clear some completed tasks.',{theme:'colored',position:'top-center',draggable:false});
            });
        }

        const Mark_All_Completed = () => {
            // update all uncompleted tasks
            const uncompleted = ToDoData.filter(t => !t.IsCompleted);
            if (uncompleted.length === 0) {
                toast.info('All tasks are already completed.',{theme:'colored',position:'top-center',draggable:false});
                return;
            }
            // Update all uncompleted tasks on server
            Promise.all(uncompleted.map(t => api.put(`/update/${t.id}`, { IsCompleted: true })))
            .then(() => {
                const updated = ToDoData.map(t => ({...t, IsCompleted: true}));
                setToDoData(updated);
                hapticNotification('success');
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
    <div className="To-Do">
        <div className="todo-header">
            <h1>To-Do List</h1>
            <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
        </div>
        <form onSubmit={(e)=>{e.preventDefault();Add_To_List();}}>
            <input value={InputValue} onChange={(e)=>setInputValue(e.target.value)} type='text' placeholder='Enter something to add to the To-Do List'/>
            <button type="submit">Add to To-Do list<FaPencilAlt size={13} color='green'/></button>
        </form>
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
        {ToDoData && ToDoData.length > 0 && (
            <div className="clear-btn-container">
                <button className="mark-all-btn" onClick={Mark_All_Completed}>Mark All Completed</button>
                <button className="clear-all-btn" onClick={Clear_All}>Clear Completed</button>
            </div>
        )}
    </div>
    </>          
  )
}
export default To_Do;
