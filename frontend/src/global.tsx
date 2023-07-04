/** @singleton */
class GlobalContext{

    username:string;
    language:string;
    authKey:string|null;
    localeRoomId:string|null;

    isAdmin = false;

    constructor(){
        this.username = localStorage.getItem("username") ?? ""; // todo moved to hook
        this.authKey = localStorage.getItem("auth_key") ?? ""; // todo moved to hook
        this.language = localStorage.getItem("user_lang") ?? "en";
        this.localeRoomId = localStorage.getItem("room_id") ?? null;    // todo moved to hook
    }

    getLocaleRoomId(){
        return this.localeRoomId;
    }

    setLocaleRoomId(localeRoomId:string){
        this.localeRoomId = localeRoomId;
    }

    clearLocaleRoomId(){
        this.localeRoomId = null;
        localStorage.removeItem("room_id");
    }

    setLang(user_lang:string){
        this.language = user_lang;
        localStorage.setItem("user_lang", user_lang);
    }

    getLang(){
        return this.language ?? "en";
    }
    
    setAuth(username:string, authKey:string){
        this.username = username;
        this.authKey = authKey;
    }

    getAuth(){
        return this.authKey;
    }

    getUsername(){
        return this.username;
    }

    setUsername(username:string){
        this.username = username;
        localStorage.setItem("username", username);
    }

    isAuth(){
        return (this.username != "" && this.authKey != "")
    }
}

const globalContext = new GlobalContext();
export default globalContext;