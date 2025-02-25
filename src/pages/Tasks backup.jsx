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
import DataAtual from "../components/DataAtual";
import Sidebar from "../components/Sidebar";

const Tasks = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [filter, setFilter] = useState("open");

  // Estado para controle do modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  // Carregar tarefas do Firestore ao logar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid));
        onSnapshot(q, (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Adicionar nova tarefa
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
    setDueDate(new Date().toISOString().split("T")[0]);
  };

  // Alternar status de conclusão da tarefa
  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  // Excluir tarefa
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Abrir modal de edição
  const openEditModal = (task) => {
    if (!task) return;
    setEditTask(task);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || "");
    setIsModalVisible(true);
    setIsClosing(false);
    setTimeout(() => setIsEditModalOpen(true), 50);
  };

  // Fechar modal de edição
  const closeEditModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setIsModalVisible(false);
      setEditTask(null);
    }, 100);
  };

  // Atualizar tarefa editada
  const handleEditTask = async () => {
    if (!editTask) return;
    await updateDoc(doc(db, "tasks", editTask.id), { title: editTitle, dueDate: editDueDate });
    closeEditModal();
  };

  // Filtros para exibir tarefas conforme o status
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
    if (filter === "today") return !task.completed && task.dueDate === new Date().toISOString().split("T")[0];
    if (filter === "future") return !task.completed && task.dueDate > new Date().toISOString().split("T")[0];
    return true;
  });

  return (
    <div className="tasks-container">
      <Sidebar user={user} filter={filter} setFilter={setFilter} handleLogout={() => signOut(auth)} />

      {isModalVisible && (
        <div className={`modal-overlay ${isEditModalOpen ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={closeEditModal}>
          <div className={`modal ${isEditModalOpen ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Tarefa</h2>
            <input type="text" className="modal-input-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <input type="date" className="modal-input-title" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={handleEditTask}>Salvar</button>
              <button onClick={closeEditModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <main className="task-list">
        <h1>{filterNames[filter]}</h1>
        <div className="form">
          <form onSubmit={handleAddTask} className="task-form">
            <input type="text" className="new-task-input" placeholder="Digite aqui uma nova tarefa..." value={newTask} onChange={(e) => setNewTask(e.target.value)} required />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <button type="submit">Adicionar</button>
          </form>

          <div className="task-categories">
            {["Atrasadas", "Hoje", "Em Breve"].map((category, index) => {
              const filtered = filteredTasks.filter((task) => {
                if (category === "Atrasadas") return task.dueDate < new Date().toISOString().split("T")[0];
                if (category === "Hoje") return task.dueDate === new Date().toISOString().split("T")[0];
                return task.dueDate > new Date().toISOString().split("T")[0];
              });

              return filtered.length > 0 ? (
                <div key={index}>
                  <h3 className="task-category">{category === "Hoje" ? `Hoje - ${<DataAtual />}` : category}</h3>
                  <ul>
                    {filtered.map((task) => (
                      <li key={task.id} className="task-item">
                        <span className="task-checkbox" onClick={() => toggleComplete(task.id, task.completed)}>
                          {task.completed ? <FaCheckCircle color="green" size={22} /> : <FaRegCircle size={22} />}
                        </span>
                        <div className="task-content">
                          <p>{task.title}</p>
                          <small className="due-date" style={{ color: category === "Atrasadas" ? "red" : category === "Hoje" ? "blue" : "green" }}>
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                        <button className="edit-button" onClick={() => openEditModal(task)}>
                          <FaPen size={18} color="blue" />
                        </button>
                        <button className="delete-button" onClick={() => deleteTask(task.id)}>
                          <FaTrash size={20} color="red" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
