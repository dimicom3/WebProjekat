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
    public class CategoryController : ControllerBase
    {

        public MainContext Context { get; set; }

        public CategoryController(MainContext context)
        {
            Context = context;
        }

        //[EnableCors("CORS")]
        [Route("GetThreadListbyCategory/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetThreadListByCategory(int id)
        {
            try
            {    
                var ThreadList = await Context.Threads.Where(t => t.Category.ID ==id).ToListAsync();  
                return Ok(ThreadList.Select(thread => 
                    new
                    {
                        thread.ID,
                        thread.Naslov
                    }
                ));

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [Route("GetAllCategories")]
        [HttpGet]
        public async Task<ActionResult> getAllCategories()
        {
            try
            {
                var categories = await Context.Categories.ToListAsync();
                return Ok(categories.Select( c =>
                new 
                {
                    c.ID,
                    c.Naziv
                }
                ));
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PostCategory")]
        [HttpPost]
        public async Task<ActionResult>  postCategory([FromBody] Category newCategory)
        { 

            if(string.IsNullOrEmpty(newCategory.Naziv) || newCategory.Naziv.Length > 50)
            {
                return BadRequest("Lose podaci");
            }

            try
            {
                Context.Categories.Add(newCategory);
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
        public async Task<ActionResult> deleteCategory(int id)
        {
            if(id <= 0)
            {
                return BadRequest("los id");
            }
            try 
            {
                var category = await Context.Categories.FindAsync(id);
                Context.Categories.Remove(category);
                await Context.SaveChangesAsync();
                return Ok("Category has been removed");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }



    }
}
