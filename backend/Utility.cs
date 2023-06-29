public static class Utility {

    public static Dictionary<string,string> CreateHubSignal(string eventName)
    {
        Dictionary<string, string> newHubResponse = new Dictionary<string, string>();
        newHubResponse["event"] = eventName;
        return newHubResponse;
    }
}