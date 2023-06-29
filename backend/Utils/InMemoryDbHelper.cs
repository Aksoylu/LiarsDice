using Microsoft.EntityFrameworkCore;

class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public List<Customer> Customers { get; set; }
}

class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
}

class DatabaseContext : DbContext
{
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Customer> Customers { get; set; }
 
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

        Customer cf = new Customer();
        cf.Name = "test";
        cf.Id = 1;
        
        this._databaseContext.Customers.Add(cf);
        this._databaseContext.SaveChanges();
    }

    public void doSomething(int id)
    {
        Customer? dbEntry = this._databaseContext.Customers.FirstOrDefault(customer => customer.Id == id);
        if(dbEntry != null)
        {
            Console.WriteLine(dbEntry?.Name);
        }
        else
        {
            Console.WriteLine("empty");
        }
    }
}