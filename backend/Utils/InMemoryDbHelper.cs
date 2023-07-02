using Microsoft.EntityFrameworkCore;

public class Authentication
{
    public int Id { get; set; }

    public string? AuthKey { get; set; }

    public string? Username { get; set; }

    public string? SocketId {get; set;}

    public string? RoomName {get; set;}
}

public class RoomPlayer
{
    public int Id {get; set;}

    public string? Username {get; set;}

    public Bid? UserBid {get; set;}

    public Boolean IsTurn {get; set;}

    public Boolean IsElected {get; set;}

    public Boolean IsInspector {get; set;}

    public Boolean IsConnectionActive {get; set;}

    public string? SocketId {get; set;}

    public int lastOnlineTimestamp {get; set;}
    
}

public class Bid
{
    public int Id { get; set;}

    public int Quality { get; set; }

    public int Dice {get; set;}
}

public class GameRoom
{
    public GameRoom()
    {
        this.RoomPlayers = new List<RoomPlayer>();
    }

    public int Id { get; set; }
    public string? Name { get; set; }
    public List<RoomPlayer> RoomPlayers { get; set; }
    public Boolean IsGameStarted {get; set;}
    public int TurnNumber { get; set; }

    public RoomPlayer? AdminUser { get; set;}
}

public class DatabaseContext : DbContext
{
    public DbSet<Authentication>? AuthenticationTable { get; set; }
    public DbSet<GameRoom>? GameRooms { get; set; }
 
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseInMemoryDatabase("inMemoryDatabase");
    }
}

public class DatabaseHelper{

    DatabaseContext _databaseContext;
    public DatabaseHelper()
    {
        DatabaseContext databaseContext = new DatabaseContext();
        databaseContext.Database.EnsureCreated();
        this._databaseContext = databaseContext;
    }

    public DatabaseContext getDatabase()
    {
        return this._databaseContext;
    }

    public Authentication? tokenAuth(String jwtToken)
    {
        return this._databaseContext.AuthenticationTable?.FirstOrDefault(customer => customer.AuthKey == jwtToken);
    }

    public Authentication? getUserByUsername(String username)
    {
        return this._databaseContext.AuthenticationTable?.FirstOrDefault(customer => customer.Username == username);
    }

    public Authentication? getUserBySocketId(String socketId)
    {
        return this._databaseContext.AuthenticationTable?.FirstOrDefault(customer => customer.SocketId == socketId);
    }

    public int getLastAuthenticationUid()
    {
        return this._databaseContext.AuthenticationTable?.OrderBy(x=>x.Id).LastOrDefault()?.Id ?? 0;
    }
    
    public int createNewRoom(String roomName, Authentication user)
    {
        user.RoomName = roomName;

        RoomPlayer newRoomPlayer = new RoomPlayer();
        newRoomPlayer.Username = user.Username;
        newRoomPlayer.SocketId = user.SocketId;
        newRoomPlayer.lastOnlineTimestamp = DateTime.Now.Millisecond;
        newRoomPlayer.IsElected = false;
        newRoomPlayer.IsInspector = true;
        newRoomPlayer.IsTurn = false;
        newRoomPlayer.UserBid = null;

        GameRoom newGameRoom = new GameRoom();
        newGameRoom.Name = roomName;
        newGameRoom.IsGameStarted = false;
        newGameRoom.TurnNumber = 0;

        newGameRoom.AdminUser = newRoomPlayer;
        newGameRoom.RoomPlayers.Add(newRoomPlayer);
        this._databaseContext.GameRooms?.Add(newGameRoom);
        this._databaseContext.SaveChanges();
        return 0;
    }

    public void joinRoom(GameRoom room, Authentication user)
    {
        user.RoomName = room.Name;

        RoomPlayer newRoomPlayer = new RoomPlayer();
        newRoomPlayer.IsConnectionActive = true;
        newRoomPlayer.IsElected = false;
        newRoomPlayer.IsInspector = true;
        newRoomPlayer.IsTurn = false;
        newRoomPlayer.lastOnlineTimestamp = DateTime.Now.Millisecond;
        newRoomPlayer.SocketId = user.SocketId;
        newRoomPlayer.UserBid = null;
        newRoomPlayer.Username = user.Username;

        room.RoomPlayers.Add(newRoomPlayer);
        this._databaseContext.SaveChanges();
    }

    public GameRoom? getRoomByName(String roomName)
    {
        return this._databaseContext.GameRooms?.FirstOrDefault(room => room.Name == roomName);
    }

    public Boolean isRoomExist(String roomName)
    {
        return (this._databaseContext.GameRooms?.FirstOrDefault(room => room.Name == roomName) != null);
    }
    
    public Boolean leaveRoom(String roomName, Authentication user)
    {
        user.RoomName = null;

        GameRoom? room = this.getRoomByName(roomName);
        RoomPlayer? player = room?.RoomPlayers.FirstOrDefault(player => player.Username == user.Username);
        if(player == null)
        {
            return false;
        }

        room?.RoomPlayers?.Remove(player);
        this._databaseContext.SaveChanges();
        return true;
    }

    public void destroyRoom(GameRoom room)
    {
        this._databaseContext.GameRooms?.Remove(room);
        this._databaseContext.SaveChanges();
    }

    public RoomPlayer pickRandomRoomPlayer(GameRoom room)
    {
        Random random = new Random(DateTime.Now.Millisecond);
        int randomPlayerIndex = (room.RoomPlayers.Count > 1) ? random.Next(0, room.RoomPlayers.Count) : 0;
        return room.RoomPlayers.ElementAt(randomPlayerIndex);
    }

    public Boolean isRoomPlayerExist(GameRoom room, Authentication user)
    {
        return (this.getRoomPlayerByName(room, user) != null);
    }

    public RoomPlayer? getRoomPlayerByName(GameRoom room, Authentication user)
    {
        return room.RoomPlayers.OrderBy(player => player.Username == user.Username).LastOrDefault();
    }

    public void setNewAdmin(GameRoom room, RoomPlayer newAdmin)
    {
        room.AdminUser = newAdmin;
        this._databaseContext.SaveChanges();
    }

    public void makeUserDisconnected(RoomPlayer player)
    {
        player.SocketId = null;
        player.lastOnlineTimestamp = DateTime.Now.Millisecond;
        player.IsConnectionActive = false;
        this._databaseContext.SaveChangesAsync();
    }

    public void makeUserReconnected(RoomPlayer player, String socketId)
    {
        player.SocketId = socketId;
        player.lastOnlineTimestamp = DateTime.Now.Millisecond;
        player.IsConnectionActive = true;
        this._databaseContext.SaveChangesAsync();
    }

    public void updateUserSocket(Authentication user, String? newSocketId)
    {
        user.SocketId = newSocketId;
        this._databaseContext.SaveChangesAsync();
    }
}