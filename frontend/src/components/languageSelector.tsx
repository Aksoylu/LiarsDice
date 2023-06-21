import React from 'react';
import './languageSelector.css';

interface LanguageSelectorProps{
    minimumValue:number;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({minimumValue}) => {


  return (
    <div className="select" tabIndex={1}>
        <input className="selectopt" name="test" type="radio" id="opt1" checked />
        <label htmlFor="opt1" className="option">English</label>
        <input className="selectopt" name="test" type="radio" id="opt2" />
        <label htmlFor="opt2" className="option">Turkish</label>
        <input className="selectopt" name="test" type="radio" id="opt3" />
        <label htmlFor="opt3" className="option">German</label>
    </div>
  );
};

export default LanguageSelector;