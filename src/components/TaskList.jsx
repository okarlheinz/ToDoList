import React from "react";
import TaskItem from "./TaskItem";
import DataAtual from "./DataAtual";

const TaskList = ({ tasks, toggleComplete, deleteTask }) => {
  return (
    <div className="task-categories">
      {["Atrasadas", "Hoje", "Em Breve"].map((category, index) => {
        const filterCondition =
          category === "Atrasadas"
            ? (task) => task.dueDate < new Date().toISOString().split("T")[0]
            : category === "Hoje"
            ? (task) => task.dueDate === new Date().toISOString().split("T")[0]
            : (task) => task.dueDate > new Date().toISOString().split("T")[0];

        const filteredTasks = tasks.filter(filterCondition);

        if (filteredTasks.length === 0) return null;

        return (
          <div key={index}>
            <h3 className="task-category">
              {category} {category === "Hoje" && <DataAtual />}
            </h3>
            <ul>
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} toggleComplete={toggleComplete} deleteTask={deleteTask} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
