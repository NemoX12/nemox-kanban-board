import { useState, useEffect } from "react";
import axios from "axios";
import { CiSquarePlus } from "react-icons/ci";
import "../styles/Board.css";
import Task from "./Task";
import TaskForm from "./TaskForm";

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCreation, setTaskCreation] = useState("");
  const [highlightedColumn, setHighlightedColumn] = useState("");

  const fetchTasks = () => {
    axios
      .get("http://localhost:5542/")
      .then((res) => res.data)
      .then((data) => setTasks(data));
  };

  useEffect(() => fetchTasks, []);

  const handleTaskForm = () => (
    <TaskForm
      fetchTasks={fetchTasks}
      taskCreation={taskCreation}
      setTaskCreation={setTaskCreation}
    />
  );

  const allowDrop = (e, status) => {
    e.preventDefault();
    setHighlightedColumn(status);
  };

  const handleDragLeave = () => {
    setHighlightedColumn("");
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setHighlightedColumn("");
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const task = tasks.find((t) => t.id === Number(taskId));
    if (!task) return;

    if (task.status === newStatus) return;

    let completion_date = task.completion_date;
    if (newStatus === "finished" && task.status !== "finished") {
      completion_date = new Date();
    } else if (task.status === "finished" && newStatus !== "finished") {
      completion_date = null;
    }

    await axios.put(`http://localhost:5542/${taskId}`, {
      status: newStatus,
      completion_date,
    });
    fetchTasks();
  };

  const renderColumn = (status, label) => (
    <div className="board_container_column">
      <div className="board_container_column_header">
        <p>{label}</p>
        <button onClick={() => setTaskCreation(status)}>
          <CiSquarePlus size={22} />
        </button>
      </div>
      <div
        className={`board_container_column_body${
          highlightedColumn === status ? " highlighted" : ""
        }`}
        onDragOver={(e) => allowDrop(e, status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks.filter((task) => task.status === status).length === 0 ? (
          <div className="board_container_column_body_empty">
            <h1>No items available</h1>
            <p>Add an item to this status and track them across status</p>
          </div>
        ) : (
          <>
            {taskCreation === status && handleTaskForm()}
            {tasks
              .filter((task) => task.status === status)
              .reverse()
              .map((task) => (
                <Task
                  creation_date={task.creation_date}
                  content={task.content}
                  status={task.status}
                  completion_date={task.completion_date}
                  id={task.id}
                  key={task.id}
                  fetchTasks={fetchTasks}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="board">
      <div className="board_container">
        {renderColumn("todo", "To Do")}
        {renderColumn("in_progress", "In Progress")}
        {renderColumn("finished", "Finished")}
      </div>
    </div>
  );
};

export default Board;
