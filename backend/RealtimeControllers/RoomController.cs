using System.Data;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

public partial class InitialController : Hub
{
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
        _database.updateUserSocket(user, Context.ConnectionId);

        /* Check is user member of another room */
        if (user.RoomName != null)
        {
             GameRoom? alreadyJoinedRoom = this._database.getRoomByName(user.RoomName);
             if(alreadyJoinedRoom != null)
             {
                var userAlreadyAnotherRoomMemberSignal = Utility.CreateHubSignal("user_already_another_room_member");
                userAlreadyAnotherRoomMemberSignal.Add("already_joined_room_name", user.RoomName);
                await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userAlreadyAnotherRoomMemberSignal);
                return;
             }
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
        _database.updateUserSocket(user, Context.ConnectionId);

        /* Check is user member of another room */
        if (user.RoomName != null)
        {
             GameRoom? alreadyJoinedRoom = this._database.getRoomByName(user.RoomName);
             if(alreadyJoinedRoom != null)
             {
                var userAlreadyAnotherRoomMemberSignal = Utility.CreateHubSignal("user_already_another_room_member");
                userAlreadyAnotherRoomMemberSignal.Add("already_joined_room_name", user.RoomName);
                await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, userAlreadyAnotherRoomMemberSignal);
                return;
             }
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
        if(this._database.getRoomPlayerByName(currentRoom, user) != null)
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
        _database.updateUserSocket(user, Context.ConnectionId);


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
        _database.updateUserSocket(user, Context.ConnectionId);
  
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
                while(randomPlayer == null || randomPlayer.Username == null)
                {
                    randomPlayer = this._database.pickRandomRoomPlayer(currentRoom);
                }

                this._database.setNewAdmin(currentRoom, randomPlayer);

                /* Send set admin signal to user. */
                var setAdminPrivateSignal = Utility.CreateHubSignal("set_admin");
                if(randomPlayer.SocketId != null)
                    await Clients.Client(randomPlayer.SocketId).SendAsync(SignalTypes.PrivateSignal, setAdminPrivateSignal);

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
}
