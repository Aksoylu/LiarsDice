using System.Net.Http.Headers;
using System.Net;
using System.Security.Authentication;

public static class Utility {

    public static Dictionary<string,string> CreateHubSignal(string eventName)
    {
        Dictionary<string, string> newHubResponse = new Dictionary<string, string>();
        newHubResponse["event"] = eventName;
        return newHubResponse;
    }

    public static Dictionary<string,string> CreateHttpResponse(string message, HttpStatusCode statusCode)
    {
        Dictionary<string, string> newHubResponse = new Dictionary<string, string>();
        newHubResponse["message"] = message;
        newHubResponse["status"] = statusCode.ToString();
        return newHubResponse;
    }

    public static String CreateChannelId()
    {
        Random random = new Random(DateTime.Now.Millisecond);
        return random.Next(1000,9999).ToString();
    }

    public static void assertAuthentication(HttpRequest request)
    {
        String jwtToken = request.Headers["jwt_token"].ToString();
        if(jwtToken != null && jwtToken.Length > 1 )
        {
            throw new AuthenticationException("JWT token already exist. Are you sure that you shouldn't be authenticated ?");
        }
    }

    public static void assertUnauthentication(HttpRequest request)
    {
        String jwtToken = request.Headers["jwt_token"].ToString();
        if(jwtToken == null || jwtToken.Length < 1 )
        {
            throw new AuthenticationException("JWT Token should placed");
        }
    }
 
    public static void createUserMockup(DatabaseHelper databaseHelper)
    {
        /* Create user 1 user */
        Authentication user1 = new Authentication();
        user1.AuthKey = "jtw_user1";
        user1.Username = "umit_1#0000";
        
        /* Create user 2 user */
        Authentication user2 = new Authentication();
        user2.AuthKey = "jtw_user2";
        user2.Username = "umit_2#0000";

        databaseHelper.getDatabase().AuthenticationTable?.Add(user1);
        databaseHelper.getDatabase().AuthenticationTable?.Add(user2);
        databaseHelper.getDatabase().SaveChanges();   
    }
}