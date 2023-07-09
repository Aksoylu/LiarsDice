import { RoomPlayer } from "./RoomPlayer";

export interface InitialStore{
    counter: number,
    quality: number,
    minimumQuality: number,
    dice: number,
    isTurn: boolean,
    isUserEliminated: boolean,
    isGameStarted: boolean,
    isSelfAdmin:boolean,
    roomPlayers:{
        [key: string]: RoomPlayer,
    },
    username:string,
    roomId:string,
    authKey:string,
    language:string,
}
