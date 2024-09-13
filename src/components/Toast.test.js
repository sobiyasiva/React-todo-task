import '@testing-library/jest-dom/extend-expect'; 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast'; 

describe('Toast Component', () => {
  test('renders the toast with the correct message and type', () => {
    const message = 'Test message';
    const type = 'success';

    render(<Toast message={message} type={type} onClose={jest.fn()} />);

    // Check if the message is displayed
    const toastElement = screen.getByText(message);
    expect(toastElement).toBeInTheDocument();

    // Check if the correct type class is applied
    expect(toastElement).toHaveClass('toast');
    expect(toastElement).toHaveClass('success');
  });
});


