// src/TaskInput.js
import React, { useState } from "react";
function TaskInput({ addTask }) {
  const [task, setTask] = useState("");

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };
  // without validation here only checking the input values

  const handleAddTask = () => {
    if (task.trim() === "") return;

    addTask(task);
    setTask("");
  };
  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={handleInputChange}
        placeholder="Enter a task"
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default TaskInput;
