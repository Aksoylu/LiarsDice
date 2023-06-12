import React from 'react';
import './actionPanel.css';

interface ActionPanelProps{
  username: string;
  isTurn: boolean;
  isEliminated: boolean;
}

const ActionPanel: React.FC<ActionPanelProps> = ({username, isTurn, isEliminated}) => {

  return (
    <div className="actionPanel">
      <div className="card actionCard">
        <div className="row card-row">
          <div className='col-4'>
              <h2 className="card-title">{username}</h2>
              <p className="card-content">Panel content goes here.</p>
          </div>
        </div>
      </div>
  </div>
  );
};

export default ActionPanel;
