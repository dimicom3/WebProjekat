using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("Comment")]
    public class Comment
    {
        [Key]
        public int ID{get; set;}

        [MaxLength(1000)]
        public string Tekst{get; set;}

        public int Upvote{get; set;}

        [JsonIgnore]
        public Thread Thread{get; set;}//v
        
        public User User{get; set;}//v
    }

}