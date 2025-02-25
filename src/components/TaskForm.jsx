import React, { useState, useEffect } from "react";
import "../pages/Tasks.css";
import { FaPlus } from "react-icons/fa";

const TaskForm = ({ handleAddTask }) => {
  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Atualiza o estado quando a tela for redimensionada
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    handleAddTask(newTask, dueDate);
    setNewTask("");
    setDueDate(getTodayDate());
    setIsModalOpen(false); // Fecha o modal ao enviar
  };

  return (
    <>
      {/* Formulário fixo no desktop */}
      {!isMobile && (
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
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button type="submit">Adicionar</button>
          </form>
        </div>
      )}

      {/* Modal no celular */}
      {isMobile && isModalOpen && (
        <div
          className="mobile-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Tarefa</h2>
            <form onSubmit={onSubmit} className="modal-task-form">
              <input
                type="text"
                className="new-task-input"
                placeholder="Digite aqui uma nova tarefa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                required
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <button type="submit">Adicionar</button>
            </form>
          </div>
        </div>
      )}

      {/* Botão Flutuante (Só aparece no mobile) */}
      {isMobile && (
        <button className="addTaskFloat" onClick={() => setIsModalOpen(true)}>
          <FaPlus size={30} />
        </button>
      )}
    </>
  );
};

export default TaskForm;
