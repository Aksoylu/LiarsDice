/** @singleton */
class GlobalContext{

    username = "";
    language = "";
    authKey = "";
    room = {    // todo implement
        roomId: "",
        isAdmin: "",
    };

    constructor(){
        this.username = localStorage.getItem("username") ?? "";
        this.authKey = localStorage.getItem("auth_key") ?? "";
        this.language = localStorage.getItem('user_lang') ?? "en";
        
    }

    isAuth(){
        return (this.username != "")
    }

    getLang(){
        return this.language;
    }

    getUsername(){
        return this.username;
    }

    getAuth(){
        return this.authKey;
    }
}

const globalContext = new GlobalContext();
export default globalContext;