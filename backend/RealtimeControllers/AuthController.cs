using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class AuthController : Hub
{
   public async Task auth_user(string name, string message)
    {
        // todo make user auth here.
        await Clients.Client(Context.ConnectionId).SendAsync(SignalTypes.PrivateSignal, "user_auth");
    }
}
