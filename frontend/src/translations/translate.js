const ENGLISH = require("./en");

const TRANSLATIONS = {
    "en": ENGLISH, 
    "de": ENGLISH, /* TODO: FOR TEST, REMOVE LATER */ 
    "tr": ENGLISH, /* TODO: FOR TEST, REMOVE LATER */ 

}

const getTranslationInstance = (lang_key) => {
    if(!Object.keys(TRANSLATIONS).includes(lang_key))
        throw "not_supported_locale"
    
    const translationInstance = TRANSLATIONS[lang_key];
    return {
        get: (item_key) => {
            return  translationInstance[item_key] ?? "not_implemented_text:" + item_key;
        }
    }
}

module.exports.getTranslationInstance = getTranslationInstance;
