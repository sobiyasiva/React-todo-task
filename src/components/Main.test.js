
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Main from "./Main";



beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
  Storage.prototype.setItem = jest.fn();
});

test("renders Main component", () => {
  render(<Main />); 
  expect(screen.getByText("TODO LIST")).toBeInTheDocument();
});

test('input field can add a task', () => {
  render(<Main />);

  // Check that the input field and button are present
  const inputField = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText('Add Task');

  // Type a task into the input field
  fireEvent.change(inputField, { target: { value: 'New Task' } });

  // Click the "Add Task" button
  fireEvent.click(addButton);

  // Check that the task has been added to the list
  const taskItem = screen.getByText('New Task');
  expect(taskItem).toBeInTheDocument();
});
test("initializes with an empty array when localStorage is null", () => {
  // Mock localStorage.getItem to return null
  Storage.prototype.getItem = jest.fn(() => null);

  render(<Main />);

  // Ensure that the component initializes correctly
  expect(screen.queryByText("Pre-existing Task")).not.toBeInTheDocument();
});

describe('Main Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders the initial empty task list', () => {
    render(<Main />);
    expect(screen.getByText('TODO LIST')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  // test('deletes an existing task', () => {
  //   render(<Main />);
    
  //   // Add a task first
  //   const input = screen.getByPlaceholderText('Enter a task');
  //   const addButton = screen.getByText('Add Task');
    
  //   fireEvent.change(input, { target: { value: 'Task to Delete' } });
  //   fireEvent.click(addButton);

  //   // Delete the task
  //   const deleteButton = screen.getByText('Delete');
  //   fireEvent.click(deleteButton);

  //   expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
  // });
});

test('should change Save Task button back to Add Task after saving', () => {
  // Render the Main component
  render(<Main />);

  // Add a new task
  const inputElement = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText('Add Task');

  fireEvent.change(inputElement, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Enter edit mode
  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);

  // Change task text and save
  const saveButton = screen.getByText('Save Task');
  fireEvent.change(inputElement, { target: { value: 'Updated Task' } });
  fireEvent.click(saveButton);

  // Check if the button label changes back to "Add Task"
  expect(screen.getByText('Add Task')).toBeInTheDocument();
});
// ----------------
// test('toggles task completion status', () => {
//   render(<Main />);
//   const input = screen.getByPlaceholderText('Enter a task');
//   fireEvent.change(input, { target: { value: 'New Task' } });
//   fireEvent.click(screen.getByText('Add Task'));

//   const checkbox = screen.getByRole('checkbox');
//   fireEvent.click(checkbox);

//   expect(checkbox).toBeChecked();
//   fireEvent.click(checkbox);
//   expect(checkbox).not.toBeChecked();
// });

// 6. Toast Messages
test('displays toast messages on adding a task', () => {
  render(<Main />);
  const input = screen.getByPlaceholderText('Enter a task');
  fireEvent.change(input, { target: { value: 'New Task' } });
  fireEvent.click(screen.getByText('Add Task'));

  expect(screen.getByText('Task added successfully')).toBeInTheDocument();
});

describe('Main Component', () => {
  // Test case for empty task input
  test('displays error toast when task input is empty or whitespace', () => {
    render(<Main />);

    // Simulate user trying to add an empty task
    fireEvent.click(screen.getByText('Add Task'));

    // Check if the error toast message is displayed
    expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
  });

  test('displays error toast when trying to save an empty task while editing', () => {
    render(<Main />);

    // Simulate adding a task first
    const input = screen.getByPlaceholderText('Enter a task');
    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Simulate editing the task
    fireEvent.click(screen.getByText('Edit'));

    // Clear the input and try to save the empty task
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.click(screen.getByText('Save Task'));

    // Check if the error toast message is displayed
    expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
  });
});
test('should not add a task if input is empty and Enter key is pressed', () => {
  // Render the Main component
  render(<Main />);

  // Get the input field
  const input = screen.getByPlaceholderText('Enter a task');

  // Simulate pressing Enter key without setting input value
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

  // Check if no task is added
  const task = screen.queryByText('Test task');
  expect(task).not.toBeInTheDocument();
});
describe('Task Input Special Characters Handling', () => {
  test('should remove special characters and display toast message', () => {
    // Render the Main component
    const { getByPlaceholderText } = render(<Main />);
    
    // Get the task input field
    const taskInput = getByPlaceholderText('Enter a task');
    
    // Simulate user typing with special characters
    fireEvent.change(taskInput, { target: { value: '@Task#1!' } });

    // Expect the input value to have special characters removed
    expect(taskInput.value).toBe('Task1');

    // Since addToast triggers a DOM event, we need to spy on the event listener
    const addToastSpy = jest.spyOn(window, 'dispatchEvent');

    // Trigger keydown event to add or save the task (optional depending on how you trigger addToast)
    fireEvent.keyDown(taskInput, { key: 'Enter', code: 'Enter' });

    // Check if addToast is called with the correct message
    expect(addToastSpy).toHaveBeenCalledWith(expect.any(CustomEvent));

    // Clean up the spy
    addToastSpy.mockRestore();
  });
});

describe('Main Component - Modal Functionality', () => {
  // it('should toggle the task completion status and close the modal when handleConfirmToggle is called', () => {
  //   const { getByText, getByRole } = render(<Main />);
  //   // getByRole-checks type as button,components etc
  //   // Set up initial state with a task
  //   const input = getByRole('textbox');
  //   fireEvent.change(input, { target: { value: 'Test Task' } });
  //   const addButton = getByText('Add Task');
  //   fireEvent.click(addButton);
    
  //   // Find the checkbox and click it to trigger the modal
  //   const checkbox = getByRole('checkbox');
  //   fireEvent.click(checkbox);
    
  //   // Mocking the confirmation to Yes (handleConfirmToggle)
  //   const yesButton = getByText('Yes');
  //   fireEvent.click(yesButton);
    
  //   // Expect the task to be marked as completed
  //   expect(checkbox.checked).toBe(true);
    
  //   // Ensure the modal is closed,dialog is used in checking close modal
  //   expect(getByRole('dialog')).not.toBeInTheDocument();
  // });

  it('should close the modal and reset the taskToToggle state when handleCloseModal is called', () => {
    const { getByText, getByRole, queryByRole } = render(<Main />);
    
    // Set up initial state with a task
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Task' } });
    const addButton = getByText('Add Task');
    fireEvent.click(addButton);
    
    // Find the checkbox and click it to trigger the modal
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Mocking the confirmation to No (handleCloseModal)
    const noButton = getByText('No');
    fireEvent.click(noButton);
    
    // Ensure the task is not toggled
    expect(checkbox.checked).toBe(false);
    
    // Ensure the modal is closed
    // queryByRole-used when something is not there,it will not throw error it returns only null
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });
});
describe('Main Component', () => {
  it('should display normalized task text with single whitespace when editing a task', () => {
    // Arrange: Render the component and set up initial state
    const { container } = render(<Main />);
    const inputElement = container.querySelector('input[type="text"]');

    // Simulate adding a task with multiple whitespaces
    fireEvent.change(inputElement, { target: { value: 'Task    with   multiple   spaces' } });
    fireEvent.click(screen.getByText('Add Task')); // Assume 'Add Task' button triggers adding

    // Simulate clicking the edit button for the task
    fireEvent.click(screen.getByText('Edit')); // Adjust selector to target the correct task edit button

    // Assert: Check if the input field displays the task with normalized whitespace
    expect(inputElement.value).toBe('Task with multiple spaces');
  });
});

test('should close the ConfirmationModal when clicking the "No" button', () => {
  // Render the Main component
  render(<Main />);
  
  // Trigger an action that opens the modal, for example, trying to delete a task
  const addButton = screen.getByText('Add Task');
  const taskInput = screen.getByPlaceholderText('Enter a task');

  // Add a task
  fireEvent.change(taskInput, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Click the delete button to open the modal
  const deleteButton = screen.getByText('Delete');
  fireEvent.click(deleteButton);

  // Check if the confirmation modal is visible
  const confirmationMessage = screen.getByText(/Are you sure you want to delete this task?/i);
  expect(confirmationMessage).toBeInTheDocument();

  // Simulate clicking the "No" button in the modal
  const noButton = screen.getByText('No');
  fireEvent.click(noButton);

  // Check if the modal is closed
  expect(confirmationMessage).not.toBeInTheDocument();
});
test('should show "No changes made" toast when editing task with the same text', () => {
  // Render the Main component
  render(<Main />);
  
  // Add a task
  const taskInput = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText('Add Task');

  fireEvent.change(taskInput, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Click the edit button to start editing
  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);

  // Try to save without making changes
  const saveButton = screen.getByText('Save Task');
  fireEvent.click(saveButton);

  // Check if the "No changes made" toast is displayed
  const toastMessage = screen.getByText('No changes made');
  expect(toastMessage).toBeInTheDocument();
});
test('should show "Task already exists" toast when trying to add a duplicate task', () => {
  // Render the Main component
  render(<Main />);
  
  // Add a task
  const taskInput = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText('Add Task');

  fireEvent.change(taskInput, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Try to add the same task again
  fireEvent.change(taskInput, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Check if the "Task already exists" toast is displayed
  const toastMessage = screen.getByText('Task already exists');
  expect(toastMessage).toBeInTheDocument();

  // Ensure task input is cleared after duplicate task attempt
  expect(taskInput.value).toBe('');
});
test('should show confirmation message when marking a completed task as In-progress', () => {
  // Render the Main component
  render(<Main />);

  // Add a new task and mark it as completed
  const taskInput = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText('Add Task');

  fireEvent.change(taskInput, { target: { value: 'Completed Task' } });
  fireEvent.click(addButton);

  // Mark the task as completed
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  // Attempt to toggle the task back to in-progress
  fireEvent.click(checkbox);

  // Use a regex to make the text matching more flexible
  const confirmationMessage = screen.getByText(/Are you sure you want to mark the task as/i);
  expect(confirmationMessage).toBeInTheDocument();
});
describe('Main Component - Delete Task', () => {
  test('should delete task and show success toast message', () => {
    // Render the Main component
    render(<Main />);

    // Add a new task
    const taskInput = screen.getByPlaceholderText('Enter a task');
    const addButton = screen.getByText('Add Task');
    fireEvent.change(taskInput, { target: { value: 'Task to Delete' } });
    fireEvent.click(addButton);

    // Confirm the task was added
    const addedTask = screen.getByText('Task to Delete');
    expect(addedTask).toBeInTheDocument();

    // Click delete button for the task
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirm the delete modal is shown
    const confirmDeleteButton = screen.getByText('Yes');
    expect(confirmDeleteButton).toBeInTheDocument();

    // Confirm the task deletion
    fireEvent.click(confirmDeleteButton);

    // Check that the task was removed from the DOM
    expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();

    // Check that a success toast message was shown
    const successToast = screen.getByText('Task deleted successfully');
    expect(successToast).toBeInTheDocument();
  });

  test('should clear input if the deleted task was being edited', () => {
    // Render the Main component
    render(<Main />);

    // Add a new task and enter edit mode
    const taskInput = screen.getByPlaceholderText('Enter a task');
    const addButton = screen.getByText('Add Task');
    fireEvent.change(taskInput, { target: { value: 'Task to Edit and Delete' } });
    fireEvent.click(addButton);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Confirm task is being edited
    expect(taskInput.value).toBe('Task to Edit and Delete');

    // Click delete button for the task
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirm the delete modal is shown
    const confirmDeleteButton = screen.getByText('Yes');
    expect(confirmDeleteButton).toBeInTheDocument();

    // Confirm the task deletion
    fireEvent.click(confirmDeleteButton);

    // Check that the task was removed from the DOM
    expect(screen.queryByText('Task to Edit and Delete')).not.toBeInTheDocument();

    // Check that the input is cleared after deleting an edited task
    expect(taskInput.value).toBe('');

    // Check that the editing mode was exited
    expect(screen.queryByText('Cancel Editing')).not.toBeInTheDocument();

    // Check that a success toast message was shown
    const successToast = screen.getByText('Task deleted successfully');
    expect(successToast).toBeInTheDocument();
  });
});
it('should prevent adding duplicate tasks', () => {
  render(<Main />);
  const taskInput = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText(/Add Task/i);

  fireEvent.change(taskInput, { target: { value: 'Task 1' } });
  fireEvent.click(addButton);

  fireEvent.change(taskInput, { target: { value: 'Task 1' } });
  fireEvent.click(addButton);

  expect(screen.getByText('Task already exists')).toBeInTheDocument();
});
it('should edit an existing task successfully', () => {
  render(<Main />);
  const taskInput = screen.getByPlaceholderText('Enter a task');
  const addButton = screen.getByText(/Add Task/i);

  // Add a task first
  fireEvent.change(taskInput, { target: { value: 'Task to Edit' } });
  fireEvent.click(addButton);

  // Click Edit button
  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);

  // Change the input value and click save
  fireEvent.change(taskInput, { target: { value: 'Edited Task' } });
  fireEvent.click(screen.getByText(/Save Task/i));

  expect(screen.getByText('Edited Task')).toBeInTheDocument();
  expect(screen.getByText('Task updated successfully')).toBeInTheDocument();
});

// ------------------------------
test('starts editing a task successfully', () => {
  render(<Main />);
  fireEvent.change(screen.getByPlaceholderText('Enter a task'), { target: { value: 'Task to Edit' } });
  fireEvent.click(screen.getByText('Add Task'));
  fireEvent.click(screen.getByText('Edit'));
  const input = screen.getByPlaceholderText('Edit task');
  expect(input).toHaveValue('Task to Edit');
});
test('saves edited task successfully', () => {
  render(<Main />);
  fireEvent.change(screen.getByPlaceholderText('Enter a task'), { target: { value: 'Task to Edit' } });
  fireEvent.click(screen.getByText('Add Task'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByPlaceholderText('Edit task'), { target: { value: 'Edited Task' } });
  fireEvent.click(screen.getByText('Save Task'));
  expect(screen.getByText('Edited Task')).toBeInTheDocument();
});
test('shows toast message for unchanged task during edit', () => {
  render(<Main />);
  fireEvent.change(screen.getByPlaceholderText('Enter a task'), { target: { value: 'Task' } });
  fireEvent.click(screen.getByText('Add Task'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByPlaceholderText('Edit task'), { target: { value: 'Task' } });
  fireEvent.click(screen.getByText('Save Task'));
  expect(screen.getByText('No changes made')).toBeInTheDocument();
});
test('confirms task status toggle', () => {
  render(<Main />);
  
  // Add a new task
  fireEvent.change(screen.getByPlaceholderText('Enter a task'), { target: { value: 'Task to Toggle' } });
  fireEvent.click(screen.getByText('Add Task'));

  // Toggle task status
  fireEvent.click(screen.getByRole('checkbox'));

  // Confirm task status toggle
  fireEvent.click(screen.getByText('Yes'));

  // Verify that the task status was updated
  expect(screen.getByText('Task successfully marked as Completed')).toBeInTheDocument();
});
test('confirms task status toggle to In-progress', () => {
  render(<Main />);

  // Add a new task
  fireEvent.change(screen.getByPlaceholderText('Enter a task'), { target: { value: 'Task to Toggle' } });
  fireEvent.click(screen.getByText('Add Task'));

  // Toggle task status to Completed first
  fireEvent.click(screen.getByRole('checkbox'));

  // Confirm the status change to Completed
  fireEvent.click(screen.getByText('Yes'));

  // Toggle task status back to In-progress
  fireEvent.click(screen.getByRole('checkbox'));

  // Confirm the status change back to In-progress
  fireEvent.click(screen.getByText('Yes'));

  // Verify that the task status was updated to In-progress
  expect(screen.getByText('Task successfully marked as In-progress')).toBeInTheDocument();
});
