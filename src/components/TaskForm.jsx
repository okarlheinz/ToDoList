import React, { useState } from "react";

const TaskForm = ({ handleAddTask }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    handleAddTask(newTask, dueDate);
    setNewTask("");
    setDueDate("");
  };

  return (
    <form onSubmit={submitHandler} className="task-form">
      <input
        type="text"
        className="new-task-input"
        placeholder="Digite uma nova tarefa..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        required
      />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default TaskForm;
