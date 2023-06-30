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

    [HttpPost("/create_authentication")]
    public ActionResult<Object> authUser()
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

    /* If user has a jwt in browser cookie, then instead login will be able invoke */
    [HttpPost("/login")]
    public ActionResult<Object> isAuthValid()
    {
        /* Assertion for unanuthenticated request */
        Utility.assertUnauthentication(Request);
        
        /* Get is user exist */
        String jwtToken = Request.Headers["jwt_token"].ToString();
        Authentication? authUser = _database.getDatabase().AuthenticationTable?.FirstOrDefault(customer => customer.AuthKey == jwtToken) ?? null;
        if(authUser == null || authUser.Username == null)
        {
            throw new DataException("User is not found");
        }

        var response = Utility.CreateHttpResponse("login_success", HttpStatusCode.OK);
        response.Add("username", authUser.Username);
        return response;
    }
}
