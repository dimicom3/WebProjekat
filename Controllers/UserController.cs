using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace webProjekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        public MainContext Context { get; set; }

        public UserController(MainContext context)
        {
            Context = context;
        }

        //[EnableCors("CORS")]
        [Route("GetUser/{id}")]
        [HttpGet]
        public async Task<ActionResult> getUser(int id)
        {
            try
            {   
                //promeniti
                var users = Context.Users;

                var user = await users.Where(p => p.ID == id).FirstOrDefaultAsync();
        
                

                return Ok(user);

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }


        [Route("PostUser")]
        [HttpPost]
        public async Task<ActionResult>  postUser([FromBody] User user)
        { 
            var userTest = Context.Users.Where(p => p.UserName == user.UserName).FirstOrDefault();



            if(string.IsNullOrEmpty(user.UserName) || user.UserName.Length > 100 || userTest != null)
            {   
                return BadRequest("los UserName");
            }
            if(string.IsNullOrEmpty(user.Mail) || user.Mail.Length > 100)
            {
                return BadRequest("los Mail");
            }
            if(string.IsNullOrEmpty(user.Ime) || user.Ime.Length > 100)
            {
                return BadRequest("los ime");
            }
            if(string.IsNullOrEmpty(user.Prezime) || user.Prezime.Length > 100)
            {
                return BadRequest("los Prezime");
            }
            if(string.IsNullOrEmpty(user.Sifra) || user.Sifra.Length > 100)
            {
                return BadRequest("los Sifra");
            }

            try
            {
                Context.Users.Add(user);
                await Context.SaveChangesAsync();
                return Ok("User registered");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }


        [Route("Login")]
        [HttpPost]
        public async Task<ActionResult>  login([FromBody] User user)
        {

            try
            {
                var userLog = await Context.Users.Where(usr => (usr.UserName == user.UserName) && (usr.Sifra == user.Sifra)).FirstOrDefaultAsync(); 
                if(userLog == null)
                    return(BadRequest("Pogresan username ili sifra"));
                return Ok(userLog);

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }



    }
}
