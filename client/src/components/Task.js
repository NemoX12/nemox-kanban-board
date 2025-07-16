import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import axios from "axios";
import "../styles/Task.css";
import formatTimestamp from "../utils/formatTimestamp";
import formatFullDate from "../utils/formatFullDate";
import backendLink from "../utils/backendLink";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "finished", label: "Finished" },
];

const Task = ({ creation_date, content, status, completion_date, id, fetchTasks }) => {
  const [editing, setEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(content);
  const [formError, setFormError] = useState("");
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleTaskDelete = async () => {
    await axios.delete(`${backendLink()}/board/${id}`, {
      withCredentials: true,
    });
    fetchTasks();
  };

  const handleTaskCreate = async (e) => {
    e.preventDefault();
    if (taskContent.length === 0) {
      setFormError("Content can't be empty!");
      return;
    } else if (taskContent.length > 255) {
      setFormError("The content is too long!");
      return;
    }
    await axios.put(
      `${backendLink()}/board/${id}`,
      {
        content: taskContent,
        status: currentStatus,
        completion_date: currentStatus === "finished" ? new Date() : null,
      },
      { withCredentials: true }
    );
    setEditing(false);
    fetchTasks();
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    await axios.put(
      `${backendLink()}/board/${id}`,
      {
        content: taskContent,
        status: newStatus,
        completion_date: newStatus === "finished" ? new Date() : null,
      },
      { withCredentials: true }
    );
    fetchTasks();
  };

  return (
    <div className="task" draggable onDragStart={handleDragStart}>
      <div className="task_header">
        <p title={formatFullDate(creation_date)}>{formatTimestamp(creation_date)}</p>
        <div className="task_header_status">
          <label id="status">Status:</label>
          <select
            className="task_status_select"
            value={currentStatus}
            onChange={handleStatusChange}
            aria-labelledby="status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="task_content">
        {!editing ? (
          <p>{content}</p>
        ) : (
          <form className="task_content_form" onSubmit={handleTaskCreate}>
            <textarea
              type="text"
              autoComplete="false"
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
            />
            {formError}
            <button className="task_content_form_button" type="submit">
              <CiSquareCheck size={22} />
            </button>
          </form>
        )}
      </div>
      <div className="task_footer">
        <button
          className="task_footer_delete"
          onClick={handleTaskDelete}
          aria-label="Delete a Task"
        >
          <FaRegTrashAlt size={16} />
        </button>
        <button
          className="task_footer_edit"
          onClick={() => setEditing((prev) => !prev)}
          aria-label="Edit a Task"
        >
          {!editing ? <FaPen size={16} /> : <FaRegTimesCircle size={16} />}
        </button>
        {completion_date && (
          <div className="task_footer_completiondate">
            <p title={`Completed on ${formatFullDate(completion_date)}`}>
              {formatTimestamp(completion_date)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
