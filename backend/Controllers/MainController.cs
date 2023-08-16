using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("/")]
[ApiController]
public class MainController : ControllerBase
{
    [HttpGet]
    public ActionResult<string> mainPage()
    {
        return "Liar's Dice Backend Service Running As Expected";
    }

    [HttpGet("check_status")]
    public ActionResult<string> checkStatus()
    {
        return "status_online";
    }
}
