import React, { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  FaRegCircle,
  FaCheckCircle,
  FaCalendarDay,
  FaCalendarAlt,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import "./Tasks.css";

const Tasks = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), {
      title: newTask,
      completed: false,
      userId: user.uid,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
    });
    setNewTask("");
    setDueDate("");
  };

  const toggleComplete = async (id, completed) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: !completed });
  };

  const deleteTask = async (id) => {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const filterNames = {
    open: "Tarefas em Aberto",
    closed: "Tarefas Concluídas",
    today: "Tarefas para Hoje",
    future: "Tarefas Futuras",
    all: "Todas as Tarefas",
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "open") return !task.completed;
    if (filter === "closed") return task.completed;
    if (filter === "today")
      return (
        !task.completed &&
        task.dueDate === new Date().toISOString().split("T")[0]
      );
    if (filter === "future")
      return (
        !task.completed && task.dueDate > new Date().toISOString().split("T")[0]
      );
    return true;
  });

  const TaskItem = ({ task, toggleComplete, deleteTask }) => (
    <li className="task-item">
      <span
        className="task-checkbox"
        onClick={() => toggleComplete(task.id, task.completed)}
      >
        {task.completed ? (
          <FaCheckCircle color="green" size={22} />
        ) : (
          <FaRegCircle size={22} />
        )}
      </span>
      <div className="task-content">
        <p>{task.title}</p>
        <small className="due-date">{task.dueDate}</small>
      </div>
      <button className="delete-button" onClick={() => deleteTask(task.id)}>
        <FaTrash size={20} color="red" />
      </button>
    </li>
  );

  return (
    <div className="tasks-container">
      <nav className="sidebar">
        <h3>
          Bem-vindo, <span>{user?.email}</span>
        </h3>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Sair
        </button>
        <button
          className={filter === "open" ? "active" : ""}
          onClick={() => setFilter("open")}
        >
          <FaRegCircle /> Em Aberto
        </button>
        <button
          className={filter === "closed" ? "active" : ""}
          onClick={() => setFilter("closed")}
        >
          <FaCheckCircle /> Concluídas
        </button>
        <button
          className={filter === "today" ? "active" : ""}
          onClick={() => setFilter("today")}
        >
          <FaCalendarDay /> Para Hoje
        </button>
        <button
          className={filter === "future" ? "active" : ""}
          onClick={() => setFilter("future")}
        >
          <FaCalendarAlt /> Futuras
        </button>
      </nav>

      <main className="task-list">
        <h1>{filterNames[filter]}</h1>
        <div className="form">
          <form onSubmit={handleAddTask} className="task-form">
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

          {filter === "open" && (
            <div className="task-categories">
              {filteredTasks.some(
                (task) => task.dueDate < new Date().toISOString().split("T")[0]
              ) && <h3 className="task-category">Atrasada</h3>}
              {filteredTasks
                .filter(
                  (task) =>
                    task.dueDate < new Date().toISOString().split("T")[0]
                )
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                  />
                ))}

              {filteredTasks.some(
                (task) =>
                  task.dueDate === new Date().toISOString().split("T")[0]
              ) && <h3 className="task-category">Hoje</h3>}
              {filteredTasks
                .filter(
                  (task) =>
                    task.dueDate === new Date().toISOString().split("T")[0]
                )
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                  />
                ))}

              {filteredTasks.some(
                (task) => task.dueDate > new Date().toISOString().split("T")[0]
              ) && <h3 className="task-category">Em Breve</h3>}
              {filteredTasks
                .filter(
                  (task) =>
                    task.dueDate > new Date().toISOString().split("T")[0]
                )
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                  />
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
