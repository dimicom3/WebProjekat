using Microsoft.EntityFrameworkCore;


namespace Models
{
    public class MainContext : DbContext
    {

        public DbSet<Thread> Threads {get; set;}
        public DbSet<Comment> Comments {get; set;}
        public DbSet<User> Users {get; set;}
        public DbSet<Category> Categories{get; set;}
        
        
        //public DbSet<Spoj> UserThrea{get; set;}

        public MainContext(DbContextOptions options) : base(options)
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
            
        }

/*ovo valjda ne treba
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                        .HasMany<Spoj>()
                        .WithOne(p => p.User);
        }


        //mapirati ovde termin 3 01:10
*/   
     }
}