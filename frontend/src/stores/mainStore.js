import { createStore } from 'redux';

const initialState = {
  counter: 0,
  quality: 1,
  minimumQuality: 1,
  dice: 1,
  isTurn: false,
  isUserEliminated: false,
  isGameStarted: false,
  isSelfAdmin: false,
  roomPlayers: {},
  username: localStorage.getItem("username") ?? "",
  roomId: localStorage.getItem("room_id") ?? null,
  authKey: localStorage.getItem("auth_key") ?? null,
};

const addRoomPlayer = (state, action) => {
  const username = action.payload.username;
  const playerData = action.payload.player;
  const updatedRoomPlayers =  {...state.roomPlayers, [username]:playerData}; 
  return {...state, roomPlayers: updatedRoomPlayers};
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGOUT":
      localStorage.removeItem("username");
      localStorage.removeItem("room_id");
      localStorage.removeItem("auth_key");

      return {
       ...initialState
      }
    case "SET_AUTH_KEY":
      localStorage.setItem("auth_key", action.payload);
      return {
        ...state,
        authKey: action.payload
      }

    case "SET_USERNAME":
      localStorage.setItem("username", action.payload);
      return {
        ...state,
        username: action.payload
      }

    case "SET_ROOM_ID":
      localStorage.setItem("room_id", action.payload);
      return {
        ...state,
        roomId: action.payload
    }

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
    
    case "SET_IS_TURN":
      return {
        ...state,
        isTurn: action.payload,
      }

    case "SET_IS_ELIMINATED":
      return {
        ...state,
        isUserEliminated: action.payload,
      }
    
    case "SET_IS_GAME_STARTED":
      return {
        ...state,
        isGameStarted: action.payload,
      }

    case "SET_IS_ADMIN":
      return {
        ...state,
        isSelfAdmin: action.payload
      }
    
    case "ADD_ROOM_PLAYER":
      return addRoomPlayer(state, action);

    case "UPDATE_ROOM_PLAYER":
      const username = action.payload.username;
      const propertyKey = action.payload.propertyKey;
      const value = action.payload.value;

      const updatedRoomPlayer =  {...state.roomPlayers[username], [propertyKey]:value}; 
      const newRoomPlayers = {...state.roomPlayers, [username]:updatedRoomPlayer};
      return {
        ...state,
        roomPlayers: newRoomPlayers
      }
    
    default:
      return state;
  }
};

const mainStore = createStore(rootReducer);
export default mainStore;
