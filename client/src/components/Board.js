import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Board.css";

import Task from "./Task";

const Board = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5542/")
      .then((res) => res.data)
      .then((data) => setTasks(data));
  }, []);

  return (
    <div className="board">
      <div className="board_container">
        <div className="board_container_column">
          <div className="board_container_column_header">To Do</div>
          <div className="board_container_column_body">
            {tasks
              .filter((task) => task.status === "todo")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    key={task.id}
                  />
                );
              })}
          </div>
        </div>
        <div className="board_container_column">
          <div className="board_container_column_header">
            <p>In Progress</p>
          </div>
          <div className="board_container_column_body">
            {tasks
              .filter((task) => task.status === "in_progress")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    key={task.id}
                  />
                );
              })}
          </div>
        </div>
        <div className="board_container_column">
          <div className="board_container_column_header">
            <p>Finished</p>
          </div>
          <div className="board_container_column_body">
            {tasks
              .filter((task) => task.status === "finished")
              .map((task) => {
                return (
                  <Task
                    creation_date={task.creation_date}
                    content={task.content}
                    status={task.status}
                    completion_date={task.completion_date}
                    key={task.id}
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
