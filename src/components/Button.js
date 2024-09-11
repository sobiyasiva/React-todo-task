import React from 'react';
import PropTypes from 'prop-types';
import './Styles.css';

// Reusable Button component
function Button({ label, onClick, className }) {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
