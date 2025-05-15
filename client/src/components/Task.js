import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import axios from "axios";
import "../styles/Task.css";

const Task = ({ creation_date, content, status, completion_date, id, fetchTasks }) => {
  const [editing, setEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(content);
  const [formError, setFormError] = useState("");

  const formatTimestamp = (timestamp) => new Date(timestamp).toISOString().split("T")[0];

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleTaskDelete = async () => {
    await axios.delete(`http://localhost:5542/${id}`);
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
    await axios.put(`http://localhost:5542/${id}`, {
      content: taskContent,
      status: status,
      completion_date: status === "finished" ? new Date() : null,
    });
    setEditing(false);
    fetchTasks();
  };

  return (
    <div className="task" draggable onDragStart={handleDragStart}>
      <div className="task_header">
        <p>{formatTimestamp(creation_date)}</p>
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
        <button className="task_footer_delete" onClick={handleTaskDelete}>
          <FaRegTrashAlt size={16} />
        </button>
        <button className="task_footer_edit" onClick={() => setEditing((prev) => !prev)}>
          {!editing ? <FaPen size={16} /> : <FaRegTimesCircle size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Task;
