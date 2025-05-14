import { FaRegTrashAlt } from "react-icons/fa";
import "../styles/Task.css";

const Task = ({ creation_date, content, status, completion_date, id }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toISOString().split("T")[0];
  };
  return (
    <div className="task">
      <div className="task_header">
        <p>{formatTimestamp(creation_date)}</p>
      </div>
      <div className="task_content">
        <p>{content}</p>
      </div>
      <div className="task_footer">
        <button className="task_footer_delete">
          <FaRegTrashAlt size={16} />
        </button>
      </div>
    </div>
  );
};

export default Task;
