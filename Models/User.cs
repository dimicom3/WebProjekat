using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("User")]
    public class User
    {
        [Key]
        public int ID{get; set;}

        [Required]
        [MaxLength(50)]
        public string UserName {get; set;}
        
        //[Required]
        [MaxLength(100)]
        public string Mail{get; set;}

        [MaxLength(50)]
        public string Sifra {get; set;}

        [MaxLength(50)]
        public string Ime {get; set;}

        [MaxLength(50)]
        public string Prezime {get; set;}

        [JsonIgnore]
        public List<Thread> UserThread {get; set;}//v

        [JsonIgnore]    
        public List<Comment> UserComment {get; set;}//v


    }

}