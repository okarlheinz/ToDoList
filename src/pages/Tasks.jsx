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
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaRegCircle, FaCheckCircle, FaPen, FaTrash } from "react-icons/fa";
import "./Tasks.css";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import Logo from "../assets/Logo.png";

const Tasks = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("open");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async (title, dueDate) => {
    await addDoc(collection(db, "tasks"), {
      title,
      completed: false,
      userId: user.uid,
      dueDate,
    });
  };

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const openEditModal = (task) => {
    if (!task) return;
    setEditTask(task);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || "");
    setIsModalVisible(true);
    setIsClosing(false);
    setTimeout(() => setIsEditModalOpen(true), 50);
  };

  const closeEditModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setIsModalVisible(false);
      setEditTask(null);
    }, 100);
  };

  const handleEditTask = async () => {
    if (!editTask) return;
    await updateDoc(doc(db, "tasks", editTask.id), {
      title: editTitle,
      dueDate: editDueDate,
    });
    closeEditModal();
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  const today = getTodayDate();

  const filterNames = {
    open: "Tarefas em Aberto",
    closed: "Tarefas Concluídas",
    today: "Tarefas para Hoje",
    future: "Tarefas Futuras",
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "open") return !task.completed;
    if (filter === "closed") return task.completed;
    if (filter === "today") return !task.completed && task.dueDate === today;
    if (filter === "future") return !task.completed && task.dueDate > today;
    return true;
  });

  return (
    <div className="tasks-container">
      <Sidebar
        user={user}
        filter={filter}
        setFilter={setFilter}
        handleLogout={() => signOut(auth)}
      />

      {isModalVisible && (
        <div
          className={`modal-overlay ${isEditModalOpen ? "show" : ""} ${
            isClosing ? "closing" : ""
          }`}
          onClick={closeEditModal}
        >
          <div
            className={`modal ${isEditModalOpen ? "show" : ""} ${
              isClosing ? "closing" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Editar Tarefa</h2>
            <input
              type="text"
              className="modal-input-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              type="date"
              className="modal-input-title"
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
        <img src={Logo} alt="CoderX" className="logo" />
        <h1>{filterNames[filter]}</h1>
        <TaskForm handleAddTask={handleAddTask} />

        <div className="task-categories">
          {filter === "open" ? (
            <>
              {/* Atrasadas */}
              {filteredTasks.some((task) => task.dueDate < today) && (
                <div className="task-category">
                  <h3>Atrasadas</h3>
                  <ul>
                    {filteredTasks
                      .filter((task) => task.dueDate < today)
                      .map((task) =>
                        renderTask(
                          task,
                          "red",
                          toggleComplete,
                          openEditModal,
                          deleteTask
                        )
                      )}
                  </ul>
                </div>
              )}

              {/* Hoje */}
              {filteredTasks.some((task) => task.dueDate === today) && (
                <div className="task-category">
                  <h3>Hoje</h3>
                  <ul>
                    {filteredTasks
                      .filter((task) => task.dueDate === today)
                      .map((task) =>
                        renderTask(
                          task,
                          "blue",
                          toggleComplete,
                          openEditModal,
                          deleteTask
                        )
                      )}
                  </ul>
                </div>
              )}

              {/* Em Breve */}
              {filteredTasks.some((task) => task.dueDate > today) && (
                <div className="task-category">
                  <h3>Em Breve</h3>
                  <ul>
                    {filteredTasks
                      .filter((task) => task.dueDate > today)
                      .map((task) =>
                        renderTask(
                          task,
                          "green",
                          toggleComplete,
                          openEditModal,
                          deleteTask
                        )
                      )}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <ul className="task-category">
              {filteredTasks.map((task) =>
                renderTask(
                  task,
                  "black",
                  toggleComplete,
                  openEditModal,
                  deleteTask
                )
              )}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

const renderTask = (task, color, toggleComplete, openEditModal, deleteTask) => (
  <li key={task.id} className="task-item">
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
      <small className="due-date" style={{ color }}>
        ({task.dueDate})
      </small>
    </div>
    <button className="edit-button" onClick={() => openEditModal(task)}>
      <FaPen className="icons" size={18} color="blue" />
    </button>
    <button className="delete-button" onClick={() => deleteTask(task.id)}>
      <FaTrash size={20} color="red" />
    </button>
  </li>
);

export default Tasks;
