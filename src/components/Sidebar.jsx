import React from "react";
import { FaRegCircle, FaCheckCircle, FaCalendarDay, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ user, filter, setFilter, handleLogout }) => {
  return (
    <nav className="sidebar">
      <h3>
        Bem-vindo, <span>{user?.email}</span>
      </h3>
      <button onClick={handleLogout} className="logout-button">
        <FaSignOutAlt /> Sair
      </button>
      <button className={filter === "open" ? "active" : ""} onClick={() => setFilter("open")}>
        <FaRegCircle /> Em Aberto
      </button>
      <button className={filter === "today" ? "active" : ""} onClick={() => setFilter("today")}>
        <FaCalendarDay /> Para Hoje
      </button>
      <button className={filter === "future" ? "active" : ""} onClick={() => setFilter("future")}>
        <FaCalendarAlt /> Futuras
      </button>
      <button className={filter === "closed" ? "active" : ""} onClick={() => setFilter("closed")}>
        <FaCheckCircle /> Concluídas
      </button>
    </nav>
  );
};

export default Sidebar;
