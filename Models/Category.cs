using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{

    public class Category
    {
        [Key]
        public int ID { get; set; }
        
        [MaxLength(50)]
        public string Naziv { get; set; }

        [JsonIgnore]
        public List<Thread> CategoryThread {get; set;}


    }


}