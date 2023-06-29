using Microsoft.EntityFrameworkCore;

public class Authentication
{
    public int Id { get; set; }
    public string AuthKey { get; set; }
    public string Username { get; set; }
    public string? SocketId { get; set; }

}

public class RoomPlayer
{
    public int Id { get; set; }

    public int UserId { get; set;}
    public string? Username { get; set; }
    public Bid? UserBid { get; set; }
    public Boolean IsTurn { get; set; }
    public Boolean IsElected { get; set; }
    public string? SocketId { get; set; }

}

public class Bid
{
    public int Id { get; set;}
    public int Quality { get; set; }
    public int Dice {get; set;}
}

public class GameRoom
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public List<RoomPlayer>? RoomPlayers { get; set; }
    public Boolean IsGameStarted {get; set;}
    public int TurnNumber { get; set; }

    public RoomPlayer AdminUser { get; set;}
    

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

    public int getLastAuthenticationUid()
    {
        return this._databaseContext.AuthenticationTable?.OrderBy(x=>x.Id).LastOrDefault()?.Id ?? 0;
    }

    public int createNewRoom(String roomName, Authentication user)
    {
        GameRoom newGameRoom = new GameRoom();
        newGameRoom.Name = roomName;
        newGameRoom.IsGameStarted = false;
        newGameRoom.TurnNumber = 0;


        RoomPlayer newRoomPlayer = new RoomPlayer();
        newRoomPlayer.Username = user.Username;
        newRoomPlayer.UserId = user.Id;
        newRoomPlayer.SocketId = user.SocketId;

        newGameRoom.AdminUser = newRoomPlayer;
        newGameRoom.RoomPlayers?.Add(newRoomPlayer);
        this._databaseContext.GameRooms?.Add(newGameRoom);
        this._databaseContext.SaveChanges();
        return 0;
    }

    public int joinRoom(GameRoom room, Authentication user)
    {
        RoomPlayer newRoomPlayer = new RoomPlayer();
        newRoomPlayer.Username = user.Username;
        newRoomPlayer.UserId = user.Id;
        newRoomPlayer.SocketId = user.SocketId;

        room.RoomPlayers?.Add(newRoomPlayer);
        this._databaseContext.SaveChanges();
        return 0;
    }
}