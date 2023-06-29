using System.Data;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class RoomController : Hub
{

    private readonly JwtHelper _jwtHelper;
    private readonly DatabaseHelper _database;

    public RoomController(JwtHelper jwtHelper, DatabaseHelper database)
    {
        _jwtHelper = jwtHelper;
        _database = database;
    }

    public async Task socketAuth(string jwtToken)
    {
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }

        user.SocketId = Context.ConnectionId;
        var privateSignal = Utility.CreateHubSignal("socket_auth_success");
        privateSignal.Add("username", user.Username);
        await Clients.Client(user.SocketId).SendAsync(SignalTypes.PrivateSignal, privateSignal);
    }

    public async Task createRoom(string jwtToken, string roomName)
    {
        /* Auth user */
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }
        
        /* Check is room already exist by room name */
        GameRoom? room =_database.getDatabase().GameRooms?.FirstOrDefault(room => room.Name == roomName);
        if(room != null)
        {
            var roomAlreadyExistSignal = Utility.CreateHubSignal("room_already_exist");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomAlreadyExistSignal);
            return;
        }

        /* Create room on database & Do database processes between room and user */
        this._database.createNewRoom(roomName, user);
            
        /* Add current user to socket group with room name */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        /* Send success signal to user */
        var createRoomSuccessSignal = Utility.CreateHubSignal("create_room_success");
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, createRoomSuccessSignal);
    }

    public async Task joinRoom(string jwtToken, string roomName)
    {

        /* Auth user */
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }

        /* Check room is exist by room name */
        GameRoom? room =_database.getDatabase().GameRooms?.FirstOrDefault(room => room.Name == roomName);
        if(room == null)
        {
            var roomNotExistSignal = Utility.CreateHubSignal("room_not_exist");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotExistSignal);
            return;
        }

        /* Check is room size available */
        if(room.RoomPlayers?.Count >= RuleBase.maximumPlayerPerRoom)
        {
            var maximumRoomPlayerExceededSignal = Utility.CreateHubSignal("maximum_room_players_exceeded");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, maximumRoomPlayerExceededSignal);
            return;
        }

        /* join room on database & Do database processes between room and user */
        this._database.joinRoom(room, user);

        /* Add current user to socket group with room name */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);


        /* Send success signal to user. This signal also contains current game room status */
        var privateSignal = Utility.CreateHubSignal("room_join_success");
        // todo: find existing user datas and bind to signal here 
        privateSignal["room_users"] = room.RoomPlayers.ToString(); 
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

        /* Send new user join signal to all remain users in room */
        var roomWideSignal = Utility.CreateHubSignal("room_join_success");

        // todo: find userhash & username from connection id and place instead of connection id
        roomWideSignal.Add("new_joined_username", user.Username);
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomWideSignal);
    }

    public async Task leave_room(string roomName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, "leave_room_success");
    }
}
