using System.Data;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Unicode;

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
        if(user == null || user.Username == null)
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
        if(user == null || user.Username == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }


        /* Check room is exist by room name */
        GameRoom? currentRoom = this._database.getRoomByName(roomName);
        if(currentRoom == null)
        {
            var roomNotExistSignal = Utility.CreateHubSignal("room_not_exist");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotExistSignal);
            return;

        }


        /* Check is room size available */
        if(currentRoom.RoomPlayers?.Count >= RuleBase.maximumPlayerPerRoom)
        {
            var maximumRoomPlayerExceededSignal = Utility.CreateHubSignal("maximum_room_players_exceeded");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, maximumRoomPlayerExceededSignal);
            return;
        }

        /* Check there is no user with same name in room */
        if(this._database.isRoomPlayerExist(currentRoom, user))
        {
            var playerWithNameAlreadyExistInRoomSignal = Utility.CreateHubSignal("player_with_name_already_exist_in_room");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, playerWithNameAlreadyExistInRoomSignal);
            return;
        }

        /* join room on database & Do database processes between room and user */
        this._database.joinRoom(currentRoom, user);

        /* Add current user to socket group with room name */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        /* Send success signal to user. This signal also contains current game room status */
        var privateSignal = Utility.CreateHubSignal("room_join_success");
        privateSignal.Add("room_users", JsonSerializer.Serialize(currentRoom.RoomPlayers));
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

        /* Send new user join signal to all remain users in room */
        var roomWideSignal = Utility.CreateHubSignal("user_joined");
        roomWideSignal.Add("user_joined", user.Username);
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomWideSignal);
    }

    public async Task reconnectRoom(string jwtToken, string roomName)
    {
        /* Auth user */
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null || user.Username == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }

        /* Check room is exist by room name */
        GameRoom? currentRoom = this._database.getRoomByName(roomName);
        if(currentRoom == null)
        {
            var roomNotExistSignal = Utility.CreateHubSignal("room_not_exist");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotExistSignal);
            return;

        }

        /* Get room player by room and user info */
        RoomPlayer? roomPlayer = this._database.getRoomPlayerByName(currentRoom, user);
        if(roomPlayer == null)
        {
            var playerNotExistInRoom = Utility.CreateHubSignal("player_not_exist_in_room");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, playerNotExistInRoom);
            return;
        }

        /* Update auth and room player instances */
        this._database.makeUserReconnected(roomPlayer, Context.ConnectionId);
        this._database.updateUserSocket(user, Context.ConnectionId);

        /* Send success signal to user. This signal also contains current game room status */
        var privateSignal = Utility.CreateHubSignal("room_reconnect_success");
        privateSignal.Add("room_users", JsonSerializer.Serialize(currentRoom.RoomPlayers));
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

        /* Send user reconnect signal to all remain users in room */
        var roomWideSignal = Utility.CreateHubSignal("user_reconnected");
        roomWideSignal.Add("reconnected_username", user.Username);
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomWideSignal);


        /* Add current user back to socket group with room name */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

    }

    public async Task leaveRoom(string jwtToken, string roomName)
    {
        /* Auth user */
        Authentication? user = _database.tokenAuth(jwtToken);
        if(user == null || user.Username == null)
        {
            var userNotFoundSignal = Utility.CreateHubSignal("authentication_failed");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userNotFoundSignal);
            return;
        }
        
        /* Check is room exist */
        if(!this._database.isRoomExist(roomName))
        {
            var roomNotFoundSignal = Utility.CreateHubSignal("room_not_found");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotFoundSignal);
            return;
        }

        /* Remove user from room database */
        Boolean removeSuccess = this._database.leaveRoom(roomName, user);
        if(!removeSuccess)
        {
            var roomNotFoundSignal = Utility.CreateHubSignal("already_not_a_room_player");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotFoundSignal);
            return;
        }

        /* Remove user from socket group */
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

        /* Send successfully leave signal to user. */
        var privateSignal = Utility.CreateHubSignal("room_leave_success");
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

        /* Send user leave signal to all remain users in room */
        var roomWideSignal = Utility.CreateHubSignal("user_leaved");
        roomWideSignal.Add("user_leaved", user.Username);
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomWideSignal);

        /* Remove users socket from socket group */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        /* Select another user as admin or kill room if leaving user is admin */
        GameRoom? currentRoom = this._database.getRoomByName(roomName);
        if(currentRoom?.AdminUser?.Username == user.Username)
        {
            if(currentRoom.RoomPlayers != null && currentRoom.RoomPlayers.Count > 0)
            {
                RoomPlayer randomPlayer = this._database.pickRandomRoomPlayer(currentRoom);
                this._database.setNewAdmin(currentRoom, randomPlayer);

                /* Send set admin signal to user. */
                var setAdminPrivateSignal = Utility.CreateHubSignal("set_admin");
                await Clients.Client(randomPlayer?.SocketId).SendAsync(SignalTypes.PrivateSignal, setAdminPrivateSignal);

                /* Send new admin signal to all remain users in room */
                var setAdminRoomWideSignal = Utility.CreateHubSignal("new_admin");
                setAdminRoomWideSignal.Add("new_admin_username", randomPlayer.Username);
                await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, setAdminRoomWideSignal);
            }
            else
            {
                this._database.destroyRoom(currentRoom);
            }
        }
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        /* Get auth user by socket id */
        Authentication? user = this._database.getUserBySocketId(Context.ConnectionId);

        if(user == null)
        {
            Console.WriteLine("step 1");
            return;
        }

        /* Set auth users socket id to null */
        this._database.updateUserSocket(user, null);

        Console.WriteLine("room name is : " + user.RoomName);
        /* Get users room by room name */
        GameRoom? currentRoom = this._database.getRoomByName(user.RoomName);
        if(currentRoom == null)
        {
            Console.WriteLine("step 2");
            return;
        }

        /* Get room player by room and user info */
        RoomPlayer roomPlayer = this._database.getRoomPlayerByName(currentRoom, user);
        if(roomPlayer == null)
        {
            Console.WriteLine("step 3");
            return;
        }

        /* Set Room Player's lastOnlineTimestamp and IsConnectionActive as disconnected */
        this._database.makeUserDisconnected(roomPlayer);

        /* Send disconnect signal to other room players */
        var setAdminRoomWideSignal = Utility.CreateHubSignal("user_disconnected");
        setAdminRoomWideSignal.Add("disconnected_username", user.Username);
        await Clients.Group(user.RoomName).SendAsync(SignalTypes.RoomSignal, setAdminRoomWideSignal);

        /* Remove user from socket group */
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.RoomName);

        Console.WriteLine("user disconnected: " + user.Username);

        /* Overrided actions */
        await base.OnDisconnectedAsync(exception);
    }

}
