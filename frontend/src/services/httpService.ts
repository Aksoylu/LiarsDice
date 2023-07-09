import axios from "axios";


/** @singleton */
class HttpService {

    headers = {
        "Content-Type": "multipart/form-data",
        "jwt_token": "",
    }

    baseUrl = "http://localhost:3453"

    constructor(){
        
    }

    /**
     * @public
     * @description: Create an authenticated user on backend and return its username & authkey
     * @param username 
     */
    async createAuthentication(username:string){
        if(!username || username.length < 2)
            return null;
        
        const parameters = {
            username : username
        };
        const response = await this._sendPost(`authentication/create_session`, parameters);
        
        if(response.status != "OK" || response.message != "auth_user_success")
            return null;
        
        return {
            auth_token: response.jtw_token,
            username: response.unique_username
        };
    }

    /**
     * @public
     * @description: Delete backend by adding token to request header and logout from signal socket
     * @param authKey
     */
    async invalidateAuthentication(authKey:string){
        if(!authKey)
            return null;
        
        this.headers.jwt_token = authKey;

        const response = await this._sendPost(`authentication/invalidate_session`, null);
        console.log(response);

        if(response.status != "OK" || response.message != "auth_invalidation_success")
            return null;

        return true;
    }

    /**
     * @private
     * @description: Sends request to backend
     * @param endpoint 
     * @param parameters 
     */
    async _sendPost(endpoint:string, parameters:any){
        const serializedParameters = parameters != null ? this._serializeParamaters(parameters) : null;
        const config = {headers: this.headers};

        const response = await axios.post(`${this.baseUrl}/${endpoint}`, serializedParameters, config);

        if(response.status == axios.HttpStatusCode.Ok)
            return response.data

        return null;
    }

    /**
     * @private
     * @description: Serializes any object as from data by its own key-value pairs
     * @param {Object} parameter
     * @returns {FormData}
     */
    _serializeParamaters(parameter:any){
        const formData = new FormData();

        const keys = Object.keys(parameter);
        for(let i = 0; i < keys.length; i++)
        {
            const eachKey = keys[i];
            const eachValue = parameter[eachKey];
            
            if(eachValue == null || eachValue.trim().length == 0)
                continue;

            formData.append(eachKey, eachValue);
        }
        return formData;
    }

}

const httpService = new HttpService();

export default httpService;
