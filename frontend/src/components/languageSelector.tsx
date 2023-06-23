import React, { ReactElement, useState, useEffect } from 'react';
import './languageSelector.css';

import deFlag from "../assets/country_flags/de.svg";
import trFlag from "../assets/country_flags/tr.svg";
import enFlag from "../assets/country_flags/us.svg";

import {Languages, LanguageSelectorTheme} from "../constants";
import globalContext from "../global";
interface LanguageSelectorProps{
  languageSelectorTheme:number|undefined;
}

const flags = {
  [Languages.EN]: enFlag,
  [Languages.TR]: trFlag,
  [Languages.DE]: deFlag,
};

const languageNames = {
  [Languages.EN]: "English",
  [Languages.TR]: "Türkçe",
  [Languages.DE]: "Deutsch",
}

const updateSelectedLanguage = (languageCode:string) => {
  globalContext.setLang(languageCode);
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({languageSelectorTheme}) => {
  
  const dropdownThemeClass = languageSelectorTheme == LanguageSelectorTheme.DARK ? "dropdown-select-dark": "dropdown-select-light";
  const optionThemeClass = languageSelectorTheme == LanguageSelectorTheme.DARK ? "language-option-dark" : "language-option-light";

  const localeSelectedLanguage = globalContext.getLang();
  const [selectedLanguage, setSelectedLanguage] = useState(localeSelectedLanguage);
  const languageArray = Object.values(Languages);

  useEffect(()=> {
    updateSelectedLanguage(selectedLanguage);
  });

  const createLanguageInputs = (languageCode:string, key:number, isActive:boolean) => {
    const itemId = "language_option_" + languageCode;
    return (<input 
      className="selectopt" type="radio" name="test" 
      id={itemId}
      key={"lang_input_" + key}
      checked={selectedLanguage == languageCode} 
      onChange={() => setSelectedLanguage(languageCode)}
    />);
  }
  
  const createLanguageLabels = (languageCode:string, key:number) => {
    const itemId = "language_option_" + languageCode;
    return (
      <label htmlFor={itemId} className={"language-option " + optionThemeClass} key={"lang_label" + key}>
        <img className='countryFlag' src={flags[languageCode]} /> {languageNames[languageCode]}
      </label>
    );
  }

  const components:Array<ReactElement> = [];
  languageArray.forEach((eachLanguage, index) => {
    components.push(createLanguageInputs(eachLanguage, index, eachLanguage == selectedLanguage, ))
    components.push(createLanguageLabels(eachLanguage, index));
  });

  return (
    <div className={"dropdown-select " + dropdownThemeClass} tabIndex={0}>
      {components}
    </div>
  );
};

export default LanguageSelector;