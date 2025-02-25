import React, { useState } from "react";
import "../pages/Tasks.css"; // Importa o CSS correto

const TaskForm = ({ handleAddTask }) => {
  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0]; // Retorna YYYY-MM-DD
  };

  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(getTodayDate());

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    handleAddTask(newTask, dueDate);
    setNewTask("");
    setDueDate(getTodayDate());
  };

  return (
    <div className="form">
      <form onSubmit={onSubmit} className="task-form">
        <input
          type="text"
          className="new-task-input"
          placeholder="Digite aqui uma nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default TaskForm;
