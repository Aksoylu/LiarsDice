import globalContext from "../global";

/** @singleton */
class WebsocketService {
    constructor(){
        
    }

    /**
     * @description: Admin only | sends start signal to backend
     */
    sendStartGameSignal(){
        if(!globalContext.isAuth())
            return;

        const authKey = globalContext.getAuth();
        console.log(authKey,">","sendStartGameSignal");
    }


}

const websocketService = new WebsocketService();

export default websocketService;
