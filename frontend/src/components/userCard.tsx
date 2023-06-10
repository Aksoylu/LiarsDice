import React from 'react';
import './userCard.css';

const UserCard: React.FC = () => {

  return (
    <div>
       <div className="card">
            <h2 className="card-title">Card Title</h2>
            <p className="card-content">Card content goes here.</p>
            <a href="#" className="card-link">Read More</a>
        </div>
    </div>    
  );
};

export default UserCard;
