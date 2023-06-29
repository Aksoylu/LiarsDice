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

    [HttpPost("/auth_user")]
    public ActionResult<string> authUser()
    {
        String user_id = Request.Form["user_id"].ToString();
        String username = Request.Form["username"].ToString();
        String token = _jwtHelper.GenerateJwtToken(user_id, username);
        _database.doSomething(Convert.ToInt32(user_id));
        return token;
    }

    // todo
    [HttpPost("/is_auth")]
    public ActionResult<Boolean> isAuthValid()
    {
        String jwtToken = Request.Form["jwt_token"].ToString();
        String username = Request.Form["username"].ToString();
        return true;
    }
}
