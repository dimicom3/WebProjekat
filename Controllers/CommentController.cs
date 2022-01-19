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
    public class CommentController : ControllerBase
    {

        public MainContext Context { get; set; }

        public CommentController(MainContext context)
        {
            Context = context;
    
        }

        //[EnableCors("CORS")]
        [Route("GetComment/{id}")]
        [HttpGet]
        public async Task<ActionResult> getComment(int id)
        {
            try
            {   
        
               // var thread = Context.Threads.Where(p => String.Equals(p.Naslov, naslov,
               //                                  StringComparison.OrdinalIgnoreCase));
              //  var threads = await Context.Threads
               //             .Include(p => p.Naslov)
                //            .Include(p=> p.Naslov)
                //            .ToListAsync();
                var comments = Context.Comments;

              // var thread = threads.Where(p => p.Naslov == naslov).FirstOrDefault();
              // await Context.Entry(thread).Collection(p => p.)
                var comment = await comments.Where(p => p.ID == id).ToListAsync();

                

                return Ok(comment);

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [Route("UpdateComment")]
        [HttpPut]
        public async Task<ActionResult> updateThread([FromBody] Comment comment)
        {

            if(comment.ID <= 0)
            {
                return BadRequest("pogresan id");
            }

            try
            {

                Context.Comments.Update(comment);
                await Context.SaveChangesAsync();

                return Ok("Comment updated");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }        



        [Route("PostComment")]
        [HttpPost]
        public async Task<ActionResult>  postComment([FromBody] Comment comment)
        { 


            if(string.IsNullOrEmpty(comment.Tekst) || comment.Tekst.Length > 1000)
            {
                return BadRequest("los tekst");
            }

            try
            {
                Context.Comments.Add(comment);
                await Context.SaveChangesAsync();
                return Ok("comment posted");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }


        [Route("PostCommentThread/{threadID}")]
        [HttpPost]
        public async Task<ActionResult>  postCommentThread([FromBody] Comment comment,[FromRoute] int threadID)
        { 
            var thread = Context.Threads
                        .Include(p => p.ThreadComment)
                        .Where(p=> p.ID == threadID)
                        .FirstOrDefault();
            
            var user = Context.Users
                        .Where( p=> ( p.UserName == comment.User.UserName) && (p.Sifra == comment.User.Sifra))
                        .FirstOrDefault();    
            
            if(thread == null)
            {
                return BadRequest("los thread ID");
            }
            if(user == null)
            {
                return BadRequest("Pogresan username ili password");
            }

            if(string.IsNullOrEmpty(comment.Tekst) || comment.Tekst.Length > 1000)
            {
                return BadRequest("los tekst");
            }

            try
            {   
                comment.User = user;
                comment.Thread = thread;
                Context.Comments.Add(comment);

                thread.ThreadComment.Add(comment); //da li je ovo nepotrebno???
                await Context.SaveChangesAsync();
                return Ok("comment posted");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }


        [Route("DeleteComment/{id}")]
        [HttpDelete]
        public async Task<ActionResult> deleteComment(int id)
        {
            if(id <= 0)
            {
                return BadRequest("los id");
            }
            try 
            {
                var comment = await Context.Comments.FindAsync(id);
                Context.Comments.Remove(comment);
                await Context.SaveChangesAsync();
                return Ok("Comment has been removed");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }



    }
}
