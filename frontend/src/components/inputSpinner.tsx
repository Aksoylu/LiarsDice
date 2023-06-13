import React from 'react';
import './inputSpinner.css';

interface InputSpinnerProps{
    minimumValue:number;
}

const InputSpinner: React.FC<InputSpinnerProps> = ({minimumValue}) => {


  return (
    <div className="inputSpinner">
        <div className="num-block skin-1">
            <div className="num-in">
                <span className="minus dis"></span>
                <input type="text" className="in-num" min={minimumValue}/> 
                <span className="plus"></span>
            </div>
        </div>
    </div>
  );
};

export default InputSpinner;
