/** @singleton */
class GlobalContext{

    username = "";
    language = "";
    authKey = "";
    localeRoomId = "";

    isAdmin = false;

    constructor(){
        this.username = localStorage.getItem("username") ?? "";
        this.authKey = localStorage.getItem("auth_key") ?? "";
        this.language = localStorage.getItem('user_lang') ?? "en";
    }

    getLocaleRoomId(){
        return this.localeRoomId;
    }

    setLocaleRoomId(localeRoomId:string){
        this.localeRoomId = localeRoomId;
    }

    setLang(lang:string){
        this.language = lang;
    }

    getLang(){
        return this.language;
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

    isAuth(){
        return (this.username != "" || this.authKey != "")
    }
}

const globalContext = new GlobalContext();
export default globalContext;