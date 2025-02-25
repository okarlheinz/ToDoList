import React, { useState } from "react";
import { FaRegCircle, FaCheckCircle, FaCalendarDay, FaCalendarAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "./Sidebar.css"; // Arquivo de estilos separado

const Sidebar = ({ user, filter, setFilter, handleLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {!isCollapsed && (
        <>
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
        </>
      )}

      {/* Botão para esconder/exibir sidebar */}
      <button className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <FaBars size={22} /> : <FaBars size={22} />}
      </button>
    </nav>
  );
};

export default Sidebar;
