using Microsoft.AspNetCore.SignalR;

public partial class InitialController : Hub
{
    public async Task playerAction(string jwtToken, string roomName, PlayerAction playerAction)
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

        await processPlayerAction(user, currentRoom, roomPlayer, playerAction);
    }

    // todo
    private async Task processPlayerAction(Authentication user, GameRoom room, RoomPlayer player, PlayerAction playerAction)
    {
        Console.WriteLine("amount:" + playerAction.Amount.ToString());
        Console.WriteLine("dice:" + playerAction.Dice.ToString());

        /* Check player availability for taking action in game */
        if(player.IsElected || player.IsInspector || !player.IsTurn)
        {
            var turnFailureSignal = Utility.CreateHubSignal("room_not_exist");
            await Clients.Client(user.SocketId).SendAsync(SignalTypes.PrivateSignal, turnFailureSignal);
            return;
        }

        /* TODO: Check is time still available to take action */

        /*  Run user action */
        if(playerAction.Type == PlayerActions.callBluff)
            callBluff(room, player, playerAction);

        else if (playerAction.Type == PlayerActions.declareBid)
            declareBid(room, player, playerAction);
        
        updatePlayerStates();
        newTurn(room, player);
    }

    private void callBluff(GameRoom room, RoomPlayer player, PlayerAction action)
    {
        /* TODO: send signal for "called bluff */
        /* TODO: wait 3 sec */

    }

    private void declareBid(GameRoom room, RoomPlayer player, PlayerAction action)
    {

    }

    // TODO: iterate room and update all players state by lastest conditions
    private void updatePlayerStates()
    {

    }

    private void newTurn(GameRoom room, RoomPlayer player)
    {
        /* TODO: set player as lastest player user */
        /* TODO: iterate room turn */
        /* TODO: assign new turn and send signal */
    }

}