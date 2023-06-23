import globalContext from "../global";

/** @singleton */
class HttpService {
    constructor(){
        
    }

    /**
     * @public
     * @description: Admin only | sends start signal to backend
     */
    async getRoomDetails(roomId){
        if(!globalContext.isAuth())
            return;

        const authKey = globalContext.getAuth();
        return "room_details"
    }


}

const httpService = new HttpService();

export default httpService;
