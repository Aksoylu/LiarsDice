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
        String username = Request.Form["username"].ToString();
        String jwtToken = _jwtHelper.GenerateJwtToken(username);
        
        Authentication newUser = new Authentication();
        newUser.AuthKey = jwtToken;
        newUser.Username = username;

        _database.getDatabase().AuthenticationTable?.Add(newUser);
        this._database.getDatabase().SaveChanges();
        
        var response = Utility.CreateHttpResponse("auth_user_success", HttpStatusCode.OK);
        response.Add("jtw_token", jwtToken);
        return response;
    }

    /* If user has a jwt in browser cookie, then instead login will be able invoke */
    [HttpPost("/login")]
    public ActionResult<Object> isAuthValid()
    {
        String jwtToken = Request.Headers["jwt_token"].ToString();
        if(jwtToken == null || jwtToken.Length < 1 )
        {
            throw new AuthenticationException("JWT Token should placed");
        }
        
        Authentication? authUser = _database.getDatabase().AuthenticationTable?.FirstOrDefault(customer => customer.AuthKey == jwtToken) ?? null;
        if(authUser == null)
        {
            throw new DataException("User is not found");
        }

        var response = Utility.CreateHttpResponse("login_success", HttpStatusCode.OK);
        response.Add("username", authUser?.Username);
        return response;
    }
}
