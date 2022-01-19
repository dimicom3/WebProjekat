using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("Thread")]
    public class Thread
    {
        [Key]
        public int ID{get; set;}

        [Required]
        [MaxLength(50)]
        public string Naslov {get; set;}
        
        [MaxLength(1000)]
        public string Tekst{get; set;}


        public List<Comment> ThreadComment {get; set;}//v
        

        public User User {get; set;}//v

        public  Category Category {get; set;}

    }

}