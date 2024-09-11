
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TaskInput from "./TaskInput";

test("renders TaskInput component", () => {
  render(<TaskInput addTask={() => {}} />);
  
  expect(screen.getByPlaceholderText("Enter a task")).toBeInTheDocument();
  expect(screen.getByText("Add Task")).toBeInTheDocument();
});

test("updates input value when typed", () => {
  render(<TaskInput addTask={() => {}} />);
  
  const input = screen.getByPlaceholderText("Enter a task");
  fireEvent.change(input, { target: { value: "New Task" } });
  
  expect(input.value).toBe("New Task");
});

test("calls addTask with correct value when Add Task is clicked", () => {
  const addTaskMock = jest.fn();
  render(<TaskInput addTask={addTaskMock} />);
  
  const input = screen.getByPlaceholderText("Enter a task");
  fireEvent.change(input, { target: { value: "Test Task" } });
  
  const addButton = screen.getByText("Add Task");
  fireEvent.click(addButton);
  
  expect(addTaskMock).toHaveBeenCalledWith("Test Task");
  expect(addTaskMock).toHaveBeenCalledTimes(1);
});

test("does not call addTask when input is empty", () => {
  const addTaskMock = jest.fn();
  render(<TaskInput addTask={addTaskMock} />);
  
  const addButton = screen.getByText("Add Task");
  fireEvent.click(addButton);
  
  expect(addTaskMock).not.toHaveBeenCalled();
});

test("clears input field after adding a task", () => {
  const addTaskMock = jest.fn();
  render(<TaskInput addTask={addTaskMock} />);
  
  const input = screen.getByPlaceholderText("Enter a task");
  fireEvent.change(input, { target: { value: "Another Task" } });
  
  const addButton = screen.getByText("Add Task");
  fireEvent.click(addButton);
  
  expect(input.value).toBe("");
});











// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import TaskInput from './TaskInput';

// describe('TaskInput Component', () => {
//   it('renders input and add button', () => {
//     const { getByPlaceholderText, getByText } = render(<TaskInput onAddTask={() => {}} />);
//     expect(getByPlaceholderText('Enter your task')).toBeInTheDocument();
//     expect(getByText('Add')).toBeInTheDocument();
//   });

//   it('updates input value on change', () => {
//     const { getByPlaceholderText } = render(<TaskInput onAddTask={() => {}} />);
//     const input = getByPlaceholderText('Enter your task');
//     fireEvent.change(input, { target: { value: 'New Task' } });
//     expect(input.value).toBe('New Task');
//   });

//   it('calls onAddTask with input value when add button is clicked', () => {
//     const handleAddTask = jest.fn();
//     const { getByPlaceholderText, getByText } = render(<TaskInput onAddTask={handleAddTask} />);
    
//     const input = getByPlaceholderText('Enter your task');
//     fireEvent.change(input, { target: { value: 'New Task' } });
    
//     fireEvent.click(getByText('Add'));
//     expect(handleAddTask).toHaveBeenCalledWith('New Task');
//   });

//   it('clears input after adding task', () => {
//     const { getByPlaceholderText, getByText } = render(<TaskInput onAddTask={() => {}} />);
//     const input = getByPlaceholderText('Enter your task');
//     fireEvent.change(input, { target: { value: 'New Task' } });
//     fireEvent.click(getByText('Add'));
//     expect(input.value).toBe('');
//   });
// });
// describe('TaskInput Component', () => {
//   it('displays a note message when trying to add an empty task', () => {
//     const handleAddTask = jest.fn();
//     const { getByPlaceholderText, getByText, getByRole } = render(<TaskInput onAddTask={handleAddTask} />);

//     const input = getByPlaceholderText('Enter your task');
//     fireEvent.change(input, { target: { value: ' ' } }); // Input only whitespace
//     fireEvent.click(getByRole('button', { name: /add/i }));

//     expect(getByText('Task cannot be empty')).toBeInTheDocument();
//     expect(handleAddTask).not.toHaveBeenCalled();
//   });

//   it('does not show the note message after successfully adding a task', () => {
//     const handleAddTask = jest.fn();
//     const { getByPlaceholderText, getByText, getByRole, queryByText } = render(<TaskInput onAddTask={handleAddTask} />);

//     const input = getByPlaceholderText('Enter your task');
//     fireEvent.change(input, { target: { value: 'Valid Task' } });
//     fireEvent.click(getByRole('button', { name: /add/i }));

//     expect(queryByText('Task cannot be empty')).not.toBeInTheDocument();
//     expect(handleAddTask).toHaveBeenCalledWith('Valid Task');
//   });
// });
