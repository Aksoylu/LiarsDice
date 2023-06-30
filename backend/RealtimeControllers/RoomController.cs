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
        
        /* Set room name to user's authentication */
        user.RoomName = roomName;

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

        /* Check there is no user with same name in room */
        RoomPlayer? existingPlayer = room.RoomPlayers?.FirstOrDefault(roomPlayer => roomPlayer.Username == user.Username);
        if(existingPlayer != null)
        {
            var playerWithNameAlreadyExistInRoomSignal = Utility.CreateHubSignal("player_with_name_already_exist_in_room");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, playerWithNameAlreadyExistInRoomSignal);
            return;
        }

        /* join room on database & Do database processes between room and user */
        this._database.joinRoom(room, user);

        /* Add current user to socket group with room name */
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        /* Send success signal to user. This signal also contains current game room status */
        var privateSignal = Utility.CreateHubSignal("room_join_success");
        privateSignal["room_users"] = room.RoomPlayers.ToString(); // TODO:  need test
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
        GameRoom? room =_database.getDatabase().GameRooms?.FirstOrDefault(room => room.Name == roomName);
        if(room == null)
        {
            var roomNotExistSignal = Utility.CreateHubSignal("room_not_exist");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotExistSignal);
            return;
        }

        /* Check there should be an user with same name in room */
        RoomPlayer? existingPlayer = room.RoomPlayers?.FirstOrDefault(roomPlayer => roomPlayer.Username == user.Username);
        if(existingPlayer == null)
        {
            var playerNotExistInRoom = Utility.CreateHubSignal("player_not_exist_in_room");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, playerNotExistInRoom);
            return;
        }

        /* update user socket */
        user.SocketId = Context.ConnectionId;

        /* Set users last online */
        existingPlayer.lastOnlineTimestamp = DateTime.Now.Millisecond;

        /* Send success signal to user. This signal also contains current game room status */
        var privateSignal = Utility.CreateHubSignal("room_join_success");
        privateSignal["room_users"] = room.RoomPlayers.ToString(); // TODO:  need test
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

        /* Send user reconnect signal to all remain users in room */
        var roomWideSignal = Utility.CreateHubSignal("user_reconnected");
        roomWideSignal.Add("reconnected_username", user.Username);
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomWideSignal);
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
        GameRoom? currentRoom = this._database.getRoomByName(roomName);
        if(currentRoom == null)
        {
            var roomNotFoundSignal = Utility.CreateHubSignal("room_not_found");
            await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, roomNotFoundSignal);
            return;
        }

        /* Remove user from room database */
        RoomPlayer? player = this._database.getRoomPlayer(currentRoom, user.Username);
        if(player != null)
        {
            currentRoom.RoomPlayers?.Remove(player);
            this._database.getDatabase().SaveChanges();
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

        /* Select another user as admin or kill room if leaving user is admin */
        if(currentRoom.AdminUser?.Username == user.Username)
        {
            if(currentRoom.RoomPlayers != null && currentRoom.RoomPlayers.Count > 0)
            {
                Random random = new Random(DateTime.Now.Millisecond);
                int randomIndex = random.Next(0, currentRoom.RoomPlayers.Count - 1);
                RoomPlayer userToBeAdmin = currentRoom.RoomPlayers.ElementAt(randomIndex);
                currentRoom.AdminUser = userToBeAdmin;

                /* Send set admin signal to user. */
                var setAdminPrivateSignal = Utility.CreateHubSignal("set_admin");
                await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, setAdminPrivateSignal);

                /* Send new admin signal to all remain users in room */
                var setAdminRoomWideSignal = Utility.CreateHubSignal("new_admin");
                setAdminRoomWideSignal.Add("new_admin", userToBeAdmin.Username);
                await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, setAdminRoomWideSignal);
                this._database.getDatabase().SaveChanges();
            }
            else
            {
                this._database.getDatabase().GameRooms?.Remove(currentRoom);
                this._database.getDatabase().SaveChanges();
            }
        }
    }
}
