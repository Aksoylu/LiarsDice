using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class RoomController : Hub
{
    public async Task join_room(string roomName)
    {
        // todo: Check group is exist

        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

        var roomSignal = Utility.CreateHubSignal("room_join_success");

        // todo: find userhash & username from connection id and place instead of connection id
        roomSignal["user_data"] = Context.ConnectionId.ToString();
        await Clients.Group(roomName).SendAsync(SignalTypes.RoomSignal, roomSignal);

        var privateSignal = Utility.CreateHubSignal("room_join_success");
        // todo: find existing user datas and bind to signal
        privateSignal["room_users"] = "user data";
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, privateSignal);

    }

    public async Task leave_room(string roomName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, "leave_room_success");
    }
}
