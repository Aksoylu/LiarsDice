import {ColorPalette} from "./ColorPalette";
import {Bid} from "./Bid";

export interface RoomPlayer {
    username: string;
    turnNumber: number;
    colorPalette: ColorPalette;
    currendBid: Bid;
    isTurn: boolean;
    isEliminated: boolean;
}