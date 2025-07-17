import { useState } from "react";
import axios from "axios";
import { CiSquareCheck } from "react-icons/ci";
import { FaRegTimesCircle } from "react-icons/fa";
import backendLink from "../utils/backendLink";
import * as z from "zod";
import taskForm from "../types/taskForm";

const TaskForm = ({ fetchTasks, taskCreation, setTaskCreation }) => {
  const [taskContent, setTaskContent] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const handleTaskCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");

    const result = z.safeParse(taskForm, { content: taskContent });
    if (result.error) {
      setMsgType("error");
      setMsg(result.error.issues[0].message);
      return;
    }

    await axios.post(
      `${backendLink()}/board`,
      {
        content: taskContent,
        status: taskCreation,
        creation_date: new Date().toISOString(),
        completion_date: taskCreation === "finished" ? new Date() : null,
      },
      { withCredentials: true }
    );

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
          <div
            className={
              msgType === "success"
                ? "msg-success"
                : msgType === "error"
                ? "msg-error"
                : ""
            }
          >
            {msg}
          </div>
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
