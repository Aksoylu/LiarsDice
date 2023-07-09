using Microsoft.VisualBasic.CompilerServices;
using System.Data;
using System.Security.Authentication;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly JwtHelper _jwtHelper;
    private readonly DatabaseHelper _database;

    public AuthenticationController(JwtHelper jwtHelper, DatabaseHelper database)
    {
        _jwtHelper = jwtHelper;
        _database = database;
    }

    [HttpPost("create_session")]
    public ActionResult<Object> createSession()
    {
        /* Assertion for already logged in user */
        Utility.assertAuthentication(Request);

        String rawUsername = Request.Form["username"].ToString();
        String? username = String.Format("{0}#{1}", rawUsername, Utility.CreateChannelId());
        
        /* Find channel ID until creating an unique username by bruteforcing channel id */
        while(_database.getUserByUsername(username) != null)
        {
            username = String.Format("{0}#{1}", rawUsername, Utility.CreateChannelId());
        }
        
        /* Create jwt token */
        String jwtToken = _jwtHelper.GenerateJwtToken(username);
        
        /* Create new user instance */
        Authentication newUser = new Authentication();
        newUser.AuthKey = jwtToken;
        newUser.Username = username;

        /* Add new user instance to database */
        _database.getDatabase().AuthenticationTable?.Add(newUser);
        this._database.getDatabase().SaveChanges();
        
        /* Send http response to client */
        var response = Utility.CreateHttpResponse("auth_user_success", HttpStatusCode.OK);
        response.Add("jtw_token", jwtToken);
        response.Add("unique_username", username);
        return response;
    }


    [HttpPost("invalidate_session")]
    public ActionResult<Object> invalidateSession()
    {
        /* Assertion for already logged in user */
        Utility.assertUnauthentication(Request);
        String authKey = Request.Headers["jwt_token"].ToString();

        /* Gets users authentication instance */
        Authentication? userSession = this._database.getUserByToken(authKey);
        if(userSession == null)
        {
            var userSessionNotExistResponse = Utility.CreateHttpResponse("user_session_not_exist", HttpStatusCode.OK);
            return userSessionNotExistResponse;
        }

        /* Make user leave if user is member of any room */
        if(userSession.RoomName != null)
        {
            this._database.leaveRoom(userSession.RoomName, userSession);
        }

        /* Remove auth instance from db */
        this._database.destroyUser(userSession);
        
        /* Send http response to client */
        var response = Utility.CreateHttpResponse("auth_invalidation_success", HttpStatusCode.OK);
        return response;
    }
}
