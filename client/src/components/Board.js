import { useState, useEffect } from "react";
import axios from "axios";
import { CiSquarePlus } from "react-icons/ci";
import "../styles/Board.css";
import Task from "./Task";
import TaskForm from "./TaskForm";

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCreation, setTaskCreation] = useState("");

  const fetchTasks = () => {
    axios
      .get("http://localhost:5542/")
      .then((res) => res.data)
      .then((data) => setTasks(data));
  };

  useEffect(() => fetchTasks, []);

  const handleTaskForm = () => {
    return (
      <TaskForm
        fetchTasks={fetchTasks}
        taskCreation={taskCreation}
        setTaskCreation={setTaskCreation}
      />
    );
  };

  return (
    <div className="board">
      <div className="board_container">
        <div className="board_container_column">
          <div className="board_container_column_header">
            <p>To Do</p>
            <button onClick={() => setTaskCreation("todo")}>
              <CiSquarePlus size={22} />
            </button>
          </div>
          <div className="board_container_column_body">
            {taskCreation === "todo" && handleTaskForm()}
            {tasks
              .filter((task) => task.status === "todo")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    id={task.id}
                    key={task.id}
                    fetchTasks={fetchTasks}
                  />
                );
              })}
          </div>
        </div>
        <div className="board_container_column">
          <div className="board_container_column_header">
            <p>In Progress</p>
            <button onClick={() => setTaskCreation("in_progress")}>
              <CiSquarePlus size={22} />
            </button>
          </div>
          <div className="board_container_column_body">
            {taskCreation === "in_progress" && handleTaskForm()}
            {tasks
              .filter((task) => task.status === "in_progress")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    id={task.id}
                    key={task.id}
                    fetchTasks={fetchTasks}
                  />
                );
              })}
          </div>
        </div>
        <div className="board_container_column">
          <div className="board_container_column_header">
            <p>Finished</p>
            <button onClick={() => setTaskCreation("finished")}>
              <CiSquarePlus size={22} />
            </button>
          </div>
          <div className="board_container_column_body">
            {taskCreation === "finished" && handleTaskForm()}
            {tasks
              .filter((task) => task.status === "finished")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    id={task.id}
                    key={task.id}
                    fetchTasks={fetchTasks}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
