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
    public class ThreadController : ControllerBase
    {

        public MainContext Context { get; set; }

        public ThreadController(MainContext context)
        {
            Context = context;
        }

        //[EnableCors("CORS")]
        [Route("GetThread/{naslov}")]
        [HttpGet]
        public async Task<ActionResult> getThread(string naslov)
        {
            try
            {   
                var threads = Context.Threads;
                var thread = await threads.Where(p => p.Naslov == naslov).ToListAsync();
                if(thread == null)
                    return BadRequest("Thread ne postoji");
                return Ok(thread);

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [Route("GetThreadByID/{id}")]
        [HttpGet]
        public async Task<ActionResult> getThreadByID(int id)
        {
            try
            {           
                var threads = Context.Threads
                                .Include(p => p.ThreadComment)
                                .ThenInclude(p => p.User)
                                .Include(p => p.User)
                                .Where(p => p.ID == id);

                var thread = await threads.FirstOrDefaultAsync();
                if(thread == null)
                    return BadRequest("Thread ne postoji");
                return Ok(thread);//smanjiti
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [Route("GetAllThreads")]
        [HttpGet]
        public async Task<ActionResult> getAllThreads()
        {
            try
            {
                var threads = await Context.Threads.ToListAsync();

                return Ok(threads.Select(
                    p => new
                    {
                        Naslov = p.Naslov
                    }
                ));
                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UpdateThread")]
        [HttpPut]
        public async Task<ActionResult> updateThread([FromBody] Thread t)
        {
            
            try
            {               
                var thread = Context.Threads
                .Include(tr => tr.User)
                .Where(tr => (tr.ID == t.ID) && (tr.User.UserName == t.User.UserName) && (tr.User.Sifra == t.User.Sifra))
                .FirstOrDefault();
            

                if(thread == null || thread.User == null)
                {
                    return BadRequest("thread ne postoji");
                }
                
                if(thread.ID <= 0)
                {
                    return BadRequest("pogresan id");
                }

                thread.Naslov = t.Naslov;
                thread.Tekst = t.Tekst;

                if(string.IsNullOrEmpty(thread.Naslov) || thread.Naslov.Length > 50)
                {
                    return BadRequest("los naslov");
                }
                if(string.IsNullOrEmpty(thread.Tekst) || thread.Tekst.Length > 1000)
                {
                    return BadRequest("los tekst");
                }

 
                Context.Threads.Update(thread);
                await Context.SaveChangesAsync();

                return Ok("Thread updated");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }        


        [Route("PostUserThread")]
        [HttpPost]
        public async Task<ActionResult>  postUserThread([FromBody] Thread thread)
        { 
       
            try
            {
                var User = Context.Users.Where(p => (p.UserName == thread.User.UserName) && (p.Sifra == thread.User.Sifra)).FirstOrDefault();
                var Category = Context.Categories.Where(c => c.ID == thread.Category.ID).FirstOrDefault();
            
                if(User == null)
                {
                    return BadRequest("los username ili pass");
                }
                if(Category == null)
                {
                    return BadRequest("los category");
                }
                if(string.IsNullOrEmpty(thread.Naslov) || thread.Naslov.Length > 50)
                {
                    return BadRequest("los naslov");
                }
                if(string.IsNullOrEmpty(thread.Tekst) || thread.Tekst.Length > 1000)
                {
                    return BadRequest("los tekst");
                }

                thread.User = (User) User;
                thread.Category = (Category) Category;
                //User.UserThread.Add(thread);
                Context.Threads.Add(thread);
                await Context.SaveChangesAsync();
                return Ok($"thread : {thread.Naslov} posted");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteThread/{id}")]
        [HttpDelete]
        public async Task<ActionResult> deleteThread([FromBody] User us, [FromRoute] int id)
        {
            try
            {
          
                var thread = Context.Threads
                .Include(tr => tr.User)
                .Where(tr =>  tr.ID == id )
                .FirstOrDefault();
              
                if(thread == null)
                {
                    return BadRequest("thread ne postoji");
                }

                var User = Context.Users
                .Where(p => (p.UserName == us.UserName) && (p.Sifra == us.Sifra) )
                .FirstOrDefault();

                if(User == null)
                {
                    return BadRequest("Pogresan username ili sifra");
                }
                if(thread.User.ID != User.ID)
                {
                    return BadRequest("Pogresan username ili sifra");
                }

                //pronaci sve komentare
                var comments =  await Context.Comments
                .Include(c => c.Thread)
                .Where(c => c.Thread.ID == thread.ID)
                .ToListAsync();

                if(comments != null)
                {
                    comments.ForEach(comment => {
                        Context.Remove(comment);
                    });
                }

                string naslov = thread.Naslov;
                Context.Threads.Remove(thread);

                await Context.SaveChangesAsync();
                return Ok($"Uspesno je izbrisan thread: {naslov}");

            }
            catch(Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }


    }
}
