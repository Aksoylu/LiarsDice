import globalContext from "../global";
import {SignalIrEvents} from "../constants";
const signalR = require('@microsoft/signalr');

/** @singleton */
class SignalIrService {

    connection:any = null;
    socketAuthListener:any = null;
    dispatch:any = null;

    constructor(){
        this.connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:3453/room", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        }).build();
        
        this.socketAuthListener = this._socketAuthListener();
    }

    build(dispatch:any){
        this.dispatch = dispatch;
    }

    async start(){
        await this.connection.start();
    }

    async stop(){
        await this.connection.stop();
    }

    getConnection(){
        return this.connection;
    }

    listenEvent(event:string, callback:any){
        this.connection.on(event, callback);   
    }

    stopListenEvent(event:string){
        this.connection.off(event);
    }

    triggerEvent(event:string, params:Array<any>){
        this.connection.invoke(event, ...params);
    }

    socketAuth(authKey:string){

        if(!authKey)
            return false;

        this.connection.invoke("socketAuth", authKey);
    }

    socketLogout(authKey:string){

        if(!authKey)
            return false;

        this.connection.invoke("socketLogout", authKey);
    }

    joinRoom(authKey?:string, roomId?:string){
        if(authKey == null || roomId == null)
            return false;

        this.connection.invoke("joinRoom", authKey, roomId);
    }


    /* =================================  */

    _socketAuthListener(){
        const handleSocketAuth = (data:any) => {
            if(data != null && data?.event == "socket_auth_success" && data?.username != null)
            {
                this.dispatch({ type: 'SET_USERNAME', payload:data.username});

                if(data?.room_id)
                    this.dispatch({ type: 'SET_ROOM_ID', payload:data.room_id});

                console.log("SOCKET AUTHENTICAION: "+ JSON.stringify(data));
                this.connection.off("socketAuth", handleSocketAuth);
            }
        }
        this.connection.on("auth_signal", handleSocketAuth);      
    }
}

const signalIrService = new SignalIrService();

export default signalIrService;
