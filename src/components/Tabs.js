import React from 'react';
import Button from './Button'; 
import './Styles.css'; 

const Tabs = ({ activeTab, onTabChange, taskCounts }) => {
  return (
    <div className="tabs-container">
      <Button
        label={`All (${taskCounts.all})`}
        onClick={() => onTabChange('all')}
        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
        // if active tab is all adding active class to all tab
      />
      <Button
        label={`In-Progress (${taskCounts.inProgress})`}
        onClick={() => onTabChange('in-progress')}
        className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
      />
      <Button
        label={`Completed (${taskCounts.completed})`}
        onClick={() => onTabChange('completed')}
        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
      />
    </div>
  );
};

export default Tabs;
