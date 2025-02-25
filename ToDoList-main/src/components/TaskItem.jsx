import React from "react";
import { FaRegCircle, FaCheckCircle, FaTrash } from "react-icons/fa";

const TaskItem = ({ task, toggleComplete, deleteTask }) => {
  return (
    <li className="task-item">
      <span className="task-checkbox" onClick={() => toggleComplete(task.id, task.completed)}>
        {task.completed ? <FaCheckCircle color="green" size={22} /> : <FaRegCircle size={22} />}
      </span>
      <div className="task-content">
        <p>{task.title}</p>
        <small className="due-date" style={{ color: task.completed ? "gray" : task.dueDate < new Date().toISOString().split("T")[0] ? "red" : "green" }}>
          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
        </small>
      </div>
      <button className="delete-button" onClick={() => deleteTask(task.id)}>
        <FaTrash size={20} color="red" />
      </button>
    </li>
  );
};

export default TaskItem;
