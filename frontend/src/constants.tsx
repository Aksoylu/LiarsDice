export const colorPaletteList = [
    { "backgroundColor": "#FFDC00", "foregroundColor": "#2ECC40" },
    { "backgroundColor": "#7FDBFF", "foregroundColor": "#FF851B" },
    { "backgroundColor": "#B10DC9", "foregroundColor": "#ffffff" },
    { "backgroundColor": "#85144B", "foregroundColor": "#01FF70" },
    { "backgroundColor": "#F012BE", "foregroundColor": "#0074D9" },
    { "backgroundColor": "#39CCCC", "foregroundColor": "#FF4136" },
    { "backgroundColor": "#3D9970", "foregroundColor": "#FFDC00" },
    { "backgroundColor": "#0074D9", "foregroundColor": "#B10DC9" },
    { "backgroundColor": "#01FF70", "foregroundColor": "#FF851B" },
    { "backgroundColor": "#2ECC40", "foregroundColor": "#F012BE" },
    { "backgroundColor": "#FF851B", "foregroundColor": "#7FDBFF" },
    { "backgroundColor": "#001F3F", "foregroundColor": "#ffffff" },
    { "backgroundColor": "#FF4136", "foregroundColor": "#ffffff" },
    { "backgroundColor": "#F012BE", "foregroundColor": "#3D9970" },
    { "backgroundColor": "#2ECC40", "foregroundColor": "#FFDC00" },
    { "backgroundColor": "#0074D9", "foregroundColor": "#2ECC40" },
    { "backgroundColor": "#3D9970", "foregroundColor": "#FF4136" },
    { "backgroundColor": "#39CCCC", "foregroundColor": "#01FF70" },
    { "backgroundColor": "#FFDC00", "foregroundColor": "#F012BE" },
    { "backgroundColor": "#7FDBFF", "foregroundColor": "#85144B" },
    { "backgroundColor": "#01FF70", "foregroundColor": "#B10DC9" },
    { "backgroundColor": "#85144B", "foregroundColor": "#FF851B" }
];

export const GameSignals = {
    game_started: 0,
    your_turn : 1,
    bluffed: 2,
    busted: 3,
    player_win: 5,
    player_eliminated: 7,
    you_lose: 8

};

export const AllowedPageSize = {
    minimumWidth: 1300,
    minimumHeight: 700
};

export const ErrorPageTypes = {
    screenSizeNotCompatible: 1,
    roomIdIsNotValid: 2
};

export const InfoActionPanelStates = {
    waitingForGameStart: 1,
    userEliminated: 2
};

export const Languages = {
    EN: "en",
    TR: "tr",
    DE: "de",
};

export const LanguageSelectorTheme = {
    DARK: 0,
    LIGHT: 1,
};

export const SignalIrEvents = {
    JOIN_ROOM: "joinRoom",
    CREATE_ROOM: "createRoom",
    LOGOUT:"socketLogout",
}