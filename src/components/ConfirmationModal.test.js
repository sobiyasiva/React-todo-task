// ConfirmationModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  test('should not render when showModal is false', () => {
    render(
      <ConfirmationModal
        showModal={false}
        onClose={() => {}}
        onConfirm={() => {}}
        taskName="Sample Task"
        confirmationMessage="Are you sure?"
      />
    );
    
    // Modal should not be in the document
    expect(screen.queryByText(/Are you sure?/)).not.toBeInTheDocument();
  });

  test('should render correctly when showModal is true', () => {
    render(
      <ConfirmationModal
        showModal={true}
        onClose={() => {}}
        onConfirm={() => {}}
        taskName="Sample Task"
        confirmationMessage="Are you sure?"
      />
    );

    // Modal should be in the document
    expect(screen.getByText(/Are you sure?/)).toBeInTheDocument();
    expect(screen.getByText(/Task: Sample Task/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No/ })).toBeInTheDocument();
  });

  test('should call onConfirm when "Yes" button is clicked', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmationModal
        showModal={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        taskName="Sample Task"
        confirmationMessage="Are you sure?"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes/ }));
    expect(onConfirm).toHaveBeenCalled();
  });

  test('should call onClose when "No" button is clicked', () => {
    const onClose = jest.fn();
    render(
      <ConfirmationModal
        showModal={true}
        onClose={onClose}
        onConfirm={() => {}}
        taskName="Sample Task"
        confirmationMessage="Are you sure?"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /No/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
