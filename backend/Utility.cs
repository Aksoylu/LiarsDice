using System.Net;

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
}