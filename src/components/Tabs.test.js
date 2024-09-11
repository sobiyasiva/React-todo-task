import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

describe('Tabs Component', () => {
  const taskCounts = {
    all: 10,
    inProgress: 3,
    completed: 7,
  };

  const mockOnTabChange = jest.fn();

  test('renders all tabs with correct counts', () => {
    render(
      <Tabs activeTab="all" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    expect(screen.getByText(/All \(10\)/)).toBeInTheDocument();
    expect(screen.getByText(/In-Progress \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Completed \(7\)/)).toBeInTheDocument();
  });

  test('applies active class to "all" tab and not to others', () => {
    render(
      <Tabs activeTab="all" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    // Check that "all" tab has the active class
    expect(screen.getByText(/All \(10\)/)).toHaveClass('active');

    // Check that "in-progress" and "completed" tabs do not have the active class
    expect(screen.getByText(/In-Progress \(3\)/)).not.toHaveClass('active');
    expect(screen.getByText(/Completed \(7\)/)).not.toHaveClass('active');
  });

  test('applies active class to "in-progress" tab and not to others', () => {
    render(
      <Tabs activeTab="in-progress" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    // Check that "in-progress" tab has the active class
    expect(screen.getByText(/In-Progress \(3\)/)).toHaveClass('active');

    // Check that "all" and "completed" tabs do not have the active class
    expect(screen.getByText(/All \(10\)/)).not.toHaveClass('active');
    expect(screen.getByText(/Completed \(7\)/)).not.toHaveClass('active');
  });

  test('applies active class to "completed" tab and not to others', () => {
    render(
      <Tabs activeTab="completed" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    // Check that "completed" tab has the active class
    expect(screen.getByText(/Completed \(7\)/)).toHaveClass('active');

    // Check that "all" and "in-progress" tabs do not have the active class
    expect(screen.getByText(/All \(10\)/)).not.toHaveClass('active');
    expect(screen.getByText(/In-Progress \(3\)/)).not.toHaveClass('active');
  });

  test('calls onTabChange with the correct tab name when clicked', () => {
    render(
      <Tabs activeTab="all" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    fireEvent.click(screen.getByText(/In-Progress \(3\)/));
    expect(mockOnTabChange).toHaveBeenCalledWith('in-progress');

    fireEvent.click(screen.getByText(/Completed \(7\)/));
    expect(mockOnTabChange).toHaveBeenCalledWith('completed');

    fireEvent.click(screen.getByText(/All \(10\)/));
    expect(mockOnTabChange).toHaveBeenCalledWith('all');
  });

  test('does not apply the active class when no tab is active', () => {
    render(
      <Tabs activeTab="" onTabChange={mockOnTabChange} taskCounts={taskCounts} />
    );

    // Check that none of the tabs have the active class
    expect(screen.getByText(/All \(10\)/)).not.toHaveClass('active');
    expect(screen.getByText(/In-Progress \(3\)/)).not.toHaveClass('active');
    expect(screen.getByText(/Completed \(7\)/)).not.toHaveClass('active');
  });
});