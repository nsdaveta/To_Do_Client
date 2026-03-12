import React, { useState } from 'react'
import { MdDoneOutline } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { FaUndo } from "react-icons/fa";
import './to-do-item.css'
import { toast } from 'react-toastify';

const ToDoItem = ({index,todo,Delete_From_List,Update_List,Done,Undo}) => {

    const [isUpdating, setIsUpdating] = useState(false)
    const [InputValue,setInputValue] = useState(todo?.title || '')
  return (
<div className={`To-Do-List ${todo.IsCompleted ? 'completed' : ''}`}>
    
    <div className="List_Items">
        {!isUpdating ? (
            <span>{`${index})                 ${todo.title}`}</span>
        ) : (
            <input
                value={InputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                placeholder={todo.title}
            />
        )}
        {
            (() => {
                const completed = todo.IsCompleted === true;
                if (!completed) {
                    if (!isUpdating) {
                        return (
                            <div className="Done_Update">
                                <button
                                    onClick={() => {
                                        Done(todo.id);
                                        toast.success(`Task ${index} completed successfully!`, {
                                            theme: 'colored',
                                            position: 'top-center',
                                            draggable: false,
                                        });
                                    }}
                                >
                                    <MdDoneOutline size={15} color="green" />
                                </button>
                                <button
                                    onClick={() => {
                                        setIsUpdating(true);
                                        toast.info(`Updating Task ${index}`, {
                                            theme: 'colored',
                                            position: 'top-center',
                                            draggable: false,
                                        });
                                    }}
                                >
                                    <LuPencilLine size={15} color="purple" />
                                </button>
                            </div>
                        );
                    } else {
                        return (
                            <div className="Save">
                                <button
                                    onClick={() => {
                                        Update_List(todo.id, InputValue);
                                        setIsUpdating(false);
                                        toast.success(`Task ${index} updated successfully!`, {
                                            theme: 'colored',
                                            position: 'top-center',
                                            draggable: false,
                                        });
                                    }}
                                >
                                    <TfiSave size={14} color="green" />
                                </button>
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className="Delete">
                            <button
                                className="Delete"
                                onClick={() => {
                                    Delete_From_List(todo.id);
                                    toast.error(`Task ${index} deleted from the list successfully!!!.`, {theme:'colored',position:'top-center',draggable:false})
                                }}
                            >
                                <MdDeleteOutline size={15} />
                            </button>
                            <button
                                onClick={() => {
                                    Undo(todo.id);
                                    toast.info(`Task ${index} marked as not completed.`, {
                                        theme: 'colored',
                                        position: 'top-center',
                                        draggable: false,
                                    });
                                }}
                            >
                                <FaUndo size={15} color="blue" />
                            </button>
                        </div>
                    );
                }
            })()
        }
    </div>
</div>
  )
}

export default ToDoItem;
