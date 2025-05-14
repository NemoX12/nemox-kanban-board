import { useState } from "react";
import axios from "axios";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegTimesCircle } from "react-icons/fa";

const TaskForm = ({ fetchTasks, taskCreation, setTaskCreation }) => {
  const [taskContent, setTaskContent] = useState("");
  const [formError, setFormError] = useState("");
  const handleTaskCreate = async (e) => {
    e.preventDefault();

    if (taskContent.length === 0) {
      setFormError("Content can't be empty!");
      return;
    } else if (taskContent.length > 255) {
      setFormError("The content is too long!");
      return;
    }

    await axios.post("http://localhost:5542/", {
      content: taskContent,
      status: taskCreation,
      completion_date: taskCreation === "finished" ? new Date() : null,
    });

    setTaskCreation("");

    fetchTasks();
  };

  return (
    <div className="task">
      <div className="task_header">
        <p>New Task</p>
      </div>
      <div className="task_content">
        <form className="task_content_form" onSubmit={handleTaskCreate}>
          <textarea
            type="text"
            autoComplete="false"
            onChange={(e) => setTaskContent(e.target.value)}
          />
          {formError}
          <button className="task_content_form_button" type="submit">
            <CiSquareCheck size={22} />
          </button>
        </form>
      </div>
      <div className="task_footer">
        <button className="task_footer_close" onClick={() => setTaskCreation("")}>
          <FaRegTimesCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
