import { createStore } from 'redux';

const initialState = {
  counter: 0,
  quality: 3,
  minimumQuality: 1,
  dice: 5,
  // Diğer değişkenler...
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BID_AMOUNT":
      const newAmount =  (action.payload < state.minimumQuality) ? state.minimumQuality : action.payload;
      return {
        ...state,
        quality: newAmount,
      };

    case "SET_DICE":
      let newDice = action.payload;
      if(newDice > 6)
        newDice = 6;

      if(newDice < 1)
        newDice = 1;
      
      return {
        ...state,
        dice: newDice,
      };

    case "SET_MINIMUM_BID_AMOUNT":
      return {
        ...state,
        minimumQuality: action.payload,
      }
    default:
      return state;
  }
};

const mainStore = createStore(rootReducer);
export default mainStore;
