import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import './Styles.css';
import ToastContainer from './ToastContainer';
import Tabs from './Tabs';
import ConfirmationModal from './ConfirmationModal';

function Main() {
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [taskToToggle, setTaskToToggle] = useState(null);
  const [taskToToggleName, setTaskToToggleName] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [taskToDeleteIndex, setTaskToDeleteIndex] = useState(null); 
  const taskInputRef = useRef(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskInputChange = (e) => {
    let value = e.target.value;
    // manages with validation
    

    if (/^\s+/.test(value)) {
      value = value.replace(/^\s+/, '');
      addToast('Whitespace at the beginnig is not allowed', 'info');
    }

    if (/[^a-zA-Z0-9 ]/.test(value)) {
      value = value.replace(/[^a-zA-Z0-9 ]/g, '');
      addToast('Special characters not allowed ', 'info');
    }
    setTaskInput(value);
  };

  const handleAddOrSaveTask = () => {
    const normalizedInput = taskInput.trim().toLowerCase();  
    if (taskInput.trim() === '') {
      addToast('Task cannot be empty', 'error');
      setTaskInput('');  
      setIsEditing(false);
      setEditingIndex(null);
      return;
    }
  
    if (isEditing) {
      if (tasks[editingIndex].text.toLowerCase() === normalizedInput) {
        addToast('No changes made', 'info');
      } else {
        const editedTask = { ...tasks[editingIndex], text: taskInput };
        const newTasks = tasks.filter((_, i) => i !== editingIndex); // Remove the edited task from its original position
        setTasks([editedTask, ...newTasks]); // Add the edited task to the top of the list
        addToast('Task updated successfully', 'success');
        const taskListContainer = document.querySelector('.task-list-container');
        if (taskListContainer) {
          taskListContainer.scrollTop = 0;
        }
        setActiveTab('all'); // Switch to "all" tab after editing only if changes were made
      }
      setTaskInput('');  
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      const isDuplicate = tasks.some(task => task.text.toLowerCase() === normalizedInput);
      if (isDuplicate) {
        addToast('Task already exists', 'error');
        setTaskInput('');  
        return;
      }  
      const newTasks = [{ text: taskInput, completed: false }, ...tasks];
      setTasks(newTasks);
      addToast('Task added successfully', 'success');
      setActiveTab('all'); 
      const taskListContainer = document.querySelector('.task-list-container');
      if (taskListContainer) {
        taskListContainer.scrollTop = 0;
      }
      setTaskInput(''); 
    }
  };
  

const startEditing = (index) => {
  // Find the correct index in the original tasks array
  const taskIndexInAll = tasks.findIndex(
    (task) => task.text === filteredTasks[index].text
  );

  setEditingIndex(taskIndexInAll);
  // Normalize the task text by trimming extra whitespace and replacing multiple spaces with a single space
  const normalizedText = tasks[taskIndexInAll].text.trim().replace(/\s+/g, ' ');
  setTaskInput(normalizedText);
  setIsEditing(true);
  if (taskInputRef.current) {
    taskInputRef.current.focus();
  }
};
  const confirmToggleTask = (index) => {
    const taskIndexInAll = tasks.findIndex(
      (task) => task.text === filteredTasks[index].text
    );
    setTaskToToggle(taskIndexInAll);
    setTaskToToggleName(tasks[taskIndexInAll].text);
  
    if (tasks[taskIndexInAll].completed) {
      setConfirmationMessage('Are you sure you want to mark the task as In-progress?');
    } else {
      setConfirmationMessage('Are you sure you want to mark the task as Completed?');
    }
    setShowModal(true);
  };

  const handleConfirmToggle = () => {
    if (taskToToggle !== null) {
      let newTasks = tasks.map((task, i) =>
        i === taskToToggle ? { ...task, completed: !task.completed } : task
      );
  
      const toggledTask = newTasks[taskToToggle];
  
      newTasks = newTasks.filter((_, i) => i !== taskToToggle);
  
      const newTab = toggledTask.completed ? 'completed' : 'in-progress';
  
      if (activeTab !== newTab && activeTab !== 'all') {
        setActiveTab(newTab);
      } 
      newTasks.unshift(toggledTask);
      setTasks(newTasks);
      if (toggledTask.completed) {
        addToast('Task successfully marked as Completed', 'success');
      } else {
        addToast('Task successfully marked as In-progress', 'success');
      }  
      setTaskToToggle(null);
    }
    setShowModal(false);
  };
  

  const handleCloseModal = () => {
    setTaskToToggle(null);
    setTaskToDeleteIndex(null); 
    setShowModal(false);
  };

  const deleteTask = (index) => {
    setTaskToDeleteIndex(index);
    setTaskToToggleName(tasks[index].text); 
    setConfirmationMessage('Are you sure you want to delete this task?');
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDeleteIndex !== null) {
      const isEditingTask = editingIndex === taskToDeleteIndex;
      const newTasks = tasks.filter((_, i) => i !== taskToDeleteIndex);
      setTasks(newTasks);
      addToast('Task deleted successfully', 'success');  
      // Clear the input field if the deleted task was being edited
      if (isEditingTask) {
        setTaskInput('');
        setIsEditing(false);
        setEditingIndex(null);
      }
  
      setTaskToDeleteIndex(null);
    }
    setShowModal(false);
  };
  const addToast = (message, type) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const taskCounts = {
    all: tasks.length,
    inProgress: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddOrSaveTask();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">TODO LIST</div>
      </div>
      <div className="task-input-container">
        <input
          type="text"
          value={taskInput}
          onChange={handleTaskInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isEditing ? "Edit task" : "Enter a task"}
          ref={taskInputRef}
        />
        <Button
          label={isEditing ? "Save Task" : "Add Task"}
          onClick={handleAddOrSaveTask}
          className={isEditing ? "save-button" : "add-button"}
        />
      </div>
      <Tabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        taskCounts={taskCounts}
      />
      <div className="task-list-header">
        <div className="task-list-title">List of Tasks</div>
        <div className="task-actions-header">Actions</div>
      </div>
      <div className="task-list-container">
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks-message">No tasks available</div>
          ) : (
            filteredTasks.map((task, index) => (
              <div key={index} className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => confirmToggleTask(index)}
                />
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.text}
                </span>
                <Button
                  label="Edit"
                  onClick={() => startEditing(index)}
                  className="edit-button"
                />
                <Button
                  label="Delete"
                  onClick={() => deleteTask(index)}
                  className="delete-button"
                />
              </div>
            ))
          )}
        </div>
        <ToastContainer />
        <ConfirmationModal
          showModal={showModal}
          onClose={handleCloseModal}
          onConfirm={taskToDeleteIndex !== null ? handleConfirmDelete : handleConfirmToggle}
          taskName={taskToToggleName}
          confirmationMessage={confirmationMessage}
        />
      </div>
    </div>
  );
}

export default Main;