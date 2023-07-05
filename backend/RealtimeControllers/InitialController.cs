using Microsoft.AspNetCore.SignalR;

public partial class InitialController : Hub
{

    private readonly JwtHelper _jwtHelper;
    private readonly DatabaseHelper _database;

    public InitialController(JwtHelper jwtHelper, DatabaseHelper database)
    {
        _jwtHelper = jwtHelper;
        _database = database;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        /* Get auth user by socket id */
        Authentication? user = this._database.getUserBySocketId(Context.ConnectionId);
        if(user == null || user.RoomName == null || user.Username == null)
            return;

        /* Set auth users socket id to null */
        this._database.updateUserSocket(user, null);

        /* Get users room by room name */
        GameRoom? currentRoom = this._database.getRoomByName(user.RoomName);
        if(currentRoom == null)
            return;

        /* Get room player by room and user info */
        RoomPlayer? roomPlayer = this._database.getRoomPlayerByName(currentRoom, user);
        if(roomPlayer == null)
            return;

        /* Set Room Player's lastOnlineTimestamp and IsConnectionActive as disconnected */
        this._database.makeUserDisconnected(roomPlayer);

        /* Send disconnect signal to other room players */
        var setAdminRoomWideSignal = Utility.CreateHubSignal("user_disconnected");
        setAdminRoomWideSignal.Add("disconnected_username", user.Username);
        await Clients.Group(user.RoomName).SendAsync(SignalTypes.RoomSignal, setAdminRoomWideSignal);

        /* Remove user from socket group */
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.RoomName);

        /* Overrided actions */
        await base.OnDisconnectedAsync(exception);
    }

    public async Task socketAuth(string jwtToken)
    {
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null || user.Username == null)
        {
            // create new user...
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.AuthSignal, userNotFoundSignal);
            return;
        }

        /* Means user is already exist. Update socket first */
        _database.updateUserSocket(user, Context.ConnectionId);

        /* Send success signal to client */
        var privateSignal = Utility.CreateHubSignal("socket_auth_success");
        privateSignal.Add("username", user.Username);

        /* Get users room if user has joined still active room */
        GameRoom? currentRoom = _database.getRoomByName(user.RoomName);
        RoomPlayer? player = _database.getRoomPlayerByName(currentRoom, user);
        if(player != null)
            privateSignal.Add("room_id", user.RoomName);

        if(user.SocketId != null)
            await Clients.Client(user.SocketId).SendAsync(SignalTypes.AuthSignal, privateSignal);
    }

    public async Task socketLogout(string jwtToken)
    {
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null || user.Username == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("already_not_authenticated");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.LogoutSignal, userNotFoundSignal);
            return;
        }

        GameRoom? currentRoom = _database.getRoomByName(user.RoomName);
        RoomPlayer? player = _database.getRoomPlayerByName(currentRoom, user);
        if(player != null)
        {
            var roomMemberCannotLogoutSignal = Utility.CreateHubSignal("room_member_cannot_logout");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.LogoutSignal, roomMemberCannotLogoutSignal);
            return;
        }
        
        _database.destroyUser(user);

        /* Send success signal to client */
        var privateSignal = Utility.CreateHubSignal("socket_logout_success");
        if(user.SocketId != null)
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.LogoutSignal, privateSignal);
    }
}