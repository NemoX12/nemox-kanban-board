import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Board.css";
import Task from "../components/Task";
import TaskForm from "../components/TaskForm";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import backendLink from "../utils/backendLink";

const Board = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [taskCreation, setTaskCreation] = useState("");
  const [highlightedColumn, setHighlightedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendLink()}/board`, {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

    setLoading(true);
    try {
      await axios.put(
        `${backendLink()}/board/${taskId}`,
        {
          status: newStatus,
          completion_date,
        },
        { withCredentials: true }
      );
      await fetchTasks();
    } finally {
      setLoading(false);
    }
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
        } ${
          tasks.filter((task) => task.status === status).length === 0 ? "" : "scrollable"
        }`}
        onDragOver={(e) => allowDrop(e, status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks.filter((task) => task.status === status).length === 0 &&
          taskCreation !== status && (
            <div className="board_container_column_body_empty">
              <h1>No items available</h1>
              <p>Add an item to this status and track them across status</p>
            </div>
          )}
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
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {loading && <Loader />}
      <Sidebar
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
      <div className={`board_wrapper ${isSidebarActive ? "" : " sidebar_collapsed"}`}>
        <div className="board">
          <div className="board_container">
            {renderColumn("todo", "To Do")}
            {renderColumn("in_progress", "In Progress")}
            {renderColumn("finished", "Finished")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
