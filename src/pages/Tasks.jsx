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
  FaPen,
  FaTrash,
} from "react-icons/fa";
import "./Tasks.css";
import DataAtual from "../components/DataAtual";
import { deleteDoc } from "firebase/firestore";

// components
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import Sidebar from "../components/Sidebar";

const Tasks = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("open");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          const loadedTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Tarefas carregadas:", loadedTasks); // Debug
          setTasks(loadedTasks);
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

  // Edição

  const openEditModal = (task) => {
    console.log("Abrindo modal para tarefa:", task); // Debug

    if (!task) {
      console.error("Erro: Nenhuma tarefa foi passada para edição.");
      return;
    }

    setEditTask(task);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || ""); // Evita erro se `dueDate` estiver indefinido
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTask(null);
  };

  const handleEditTask = async () => {
    if (!editTask) return;

    const taskRef = doc(db, "tasks", editTask.id);
    await updateDoc(taskRef, { title: editTitle, dueDate: editDueDate });

    closeEditModal();
  };

  // Fim edição

  return (
    <div className="tasks-container">
      <Sidebar
        user={user}
        filter={filter}
        setFilter={setFilter}
        handleLogout={() => signOut(auth)}
      />
      {isEditModalOpen && console.log("Modal deve estar visível")}

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Tarefa</h2>
            <input
              className="modal-input-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              className="modal-input-title"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleEditTask}>Salvar</button>
              <button onClick={closeEditModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <main className="task-list">
        <h1>{filterNames[filter]}</h1> {/* Título dinâmico da página */}
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

          <div className="task-categories">
            {/* Atrasadas */}
            {filteredTasks.some(
              (task) => task.dueDate < new Date().toISOString().split("T")[0]
            ) && (
              <>
                <h3 className="task-category">Atrasadas</h3>
                <ul>
                  {filteredTasks
                    .filter(
                      (task) =>
                        task.dueDate < new Date().toISOString().split("T")[0]
                    )
                    .map((task) => (
                      <li key={task.id} className="task-item">
                        <span
                          className="task-checkbox"
                          onClick={() =>
                            toggleComplete(task.id, task.completed)
                          }
                        >
                          {task.completed ? (
                            <FaCheckCircle color="green" size={22} />
                          ) : (
                            <FaRegCircle size={22} />
                          )}
                        </span>
                        <div className="task-content">
                          <p>{task.title}</p>
                          <small className="due-date" style={{ color: "red" }}>
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(task)}
                        >
                          <FaPen size={18} color="blue" />
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                        >
                          <FaTrash size={20} color="red" />
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            )}

            {/* Hoje */}
            {filteredTasks.some(
              (task) => task.dueDate === new Date().toISOString().split("T")[0]
            ) && (
              <>
                <h3 className="task-category">
                  Hoje - <DataAtual />
                </h3>
                <ul>
                  {filteredTasks
                    .filter(
                      (task) =>
                        task.dueDate === new Date().toISOString().split("T")[0]
                    )
                    .map((task) => (
                      <li key={task.id} className="task-item">
                        <span
                          className="task-checkbox"
                          onClick={() =>
                            toggleComplete(task.id, task.completed)
                          }
                        >
                          {task.completed ? (
                            <FaCheckCircle color="green" size={22} />
                          ) : (
                            <FaRegCircle size={22} />
                          )}
                        </span>
                        <div className="task-content">
                          <p>{task.title}</p>
                          <small className="due-date" style={{ color: "blue" }}>
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(task)}
                        >
                          <FaPen size={18} color="blue" />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                        >
                          <FaTrash size={20} color="red" />
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            )}

            {/* Em Breve */}
            {filteredTasks.some(
              (task) => task.dueDate > new Date().toISOString().split("T")[0]
            ) && (
              <>
                <h3 className="task-category">Em Breve</h3>
                <ul>
                  {filteredTasks
                    .filter(
                      (task) =>
                        task.dueDate > new Date().toISOString().split("T")[0]
                    )
                    .map((task) => (
                      <li key={task.id} className="task-item">
                        <span
                          className="task-checkbox"
                          onClick={() =>
                            toggleComplete(task.id, task.completed)
                          }
                        >
                          {task.completed ? (
                            <FaCheckCircle color="green" size={22} />
                          ) : (
                            <FaRegCircle size={22} />
                          )}
                        </span>
                        <div className="task-content">
                          <p>{task.title}</p>
                          <small
                            className="due-date"
                            style={{ color: "green" }}
                          >
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(task)}
                        >
                          <FaPen size={18} color="blue" />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                        >
                          <FaTrash size={20} color="red" />
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;

// Teste de commit PC John
