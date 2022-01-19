import { Comment } from "./Comment.js";

export class Thread{

    constructor(id, naslov, board)
    {
        this.id = id;
        this.naslov = naslov;
        this.tekst = null;
        this.user = null;
        this.cont = null;
        this.board = board;
        this.commentList = [];

    }

    //ovo crta jedan thread ali na zajednickoj stranici
    crtaj(host)
    {
        
        this.cont = document.createElement("div");
        this.cont.className = "threadExc";
        host.appendChild(this.cont);
        this.cont.onclick = (ev) => this.crtajSinglePageThread(host);

        var el = document.createElement("h1");
        el.innerHTML=this.naslov;
        this.cont.appendChild(el);
        
    }

    //funkcija koja bi ucitala sve potrebne podatke o threadu
    async getAllInfo(hostZaKomentare)
    {
        const response = await fetch("https://localhost:5001/Thread/GetThreadByID/"+this.id);
        const json =  await response.json();
        this.naslov = json.naslov;
        this.tekst = json.tekst;
        this.user = json.user.userName;

        if (json.threadComment != null)
        { 
            json.threadComment.forEach(comment => {
                let c = new Comment(comment.id, comment.tekst, comment.user.userName);
                this.commentList.push(c);
                c.crtaj(hostZaKomentare);
            });
        }
        return;
    }

    async crtajSinglePageThread(host)
    {
        
        var komentari = document.createElement("div");
        await this.getAllInfo(komentari);

        this.cleanPage(host);

        //crtanje
        this.cont = document.createElement("div");
        this.cont.className = "singlePageThread";
        host.appendChild(this.cont);

        var el = document.createElement("h1");
        el.innerHTML=this.naslov;
        this.cont.appendChild(el);
        
        el = document.createElement("p");
        el.innerHTML=this.tekst;
        this.cont.appendChild(el);

        el = document.createElement("p");
        el.innerHTML="Posted by " + this.user;
        this.cont.appendChild(el);

        el = document.createElement("button");
        el.innerHTML="EDIT";
        el.onclick = (ev) => this.crtajUpdateThread(host);
        this.cont.appendChild(el);
        
        el = document.createElement("button");
        el.innerHTML="DELETE";
        el.onclick = (ev) => this.crtajDeleteThread(host);
        this.cont.appendChild(el);



        this.cont.appendChild(komentari);
        komentari.className = "commentList";
    
        //dodaj novi komentar
        var dodajKoment = document.createElement("div");
        dodajKoment.className = "postComment";
        dodajKoment.className += " Form";
        this.cont.appendChild(dodajKoment);

        el = document.createElement("button");
        el.innerHTML = "POST COMMENT";
        dodajKoment.appendChild(el);
        el.onclick = (ev) => this.crtajPostComment(dodajKoment);

    }


    crtajPostComment(host)
    {

        this.cleanPage(host);
                
        var textarea = document.createElement("textarea");
        textarea.value="Unesi komentar ovde";
        textarea.maxLength = "1000";
        textarea.cols = "27";
        textarea.rows = "19";
        host.appendChild(textarea);
        
        var btn = document.createElement("button");
        btn.innerHTML="POST";
        btn.onclick = (ev) => this.postComment(this.board.username, this.board.password, textarea.value, host);
        host.appendChild(btn);

    }


    postComment(username, password, text, host)
    {

        if(username===null || username===undefined || username==="")
        {
            alert("Login!");
            return;
        }
        if(password===null || password===undefined || password==="")
        {
            alert("Login!");
            return;
        }
        if(text===null || text===undefined || text==="")
        {
            alert("unesite text");
            return;
        }

        fetch("https://localhost:5001/Comment/PostCommentThread/"+this.id,
        {
            method:"POST",
            headers:
            {
                "Content-type":"application/json"
            },
            body:JSON.stringify(
                {
                    "tekst" : text,
                    "user":
                    {
                        "username":username,
                        "sifra": password
                    }
                })
        }).then(response => { 
            if(response.ok)
            {   

                alert("Comment posted");
                this.cleanPage(host);
                let el = document.createElement("button");
                el.innerHTML = "POST COMMENT";
                host.appendChild(el);
                el.onclick = (ev) => this.crtajPostComment(host);
        
            }
            else
            {
                alert("Doslo je do greske");
            }
            
        });

    }


    crtajUpdateThread(host)
    {
        this.cleanPage(host);

        //crtanje
        this.cont = document.createElement("div");
        this.cont.className = "updateThreadForm";
        this.cont.className += " Form";
        host.appendChild(this.cont);

        var label = document.createElement("label");
        label.innerHTML = "Title:"
        this.cont.appendChild(label);
        var input = document.createElement("input");
        input.type = "text";
        input.value = this.naslov;
        this.cont.appendChild(input);
        
        label = document.createElement("label");
        label.innerHTML = "Text:"
        this.cont.appendChild(label);
        var textarea = document.createElement("textarea");
        textarea.value=this.tekst;
        textarea.maxLength = "1000";
        textarea.cols = "27";
        textarea.rows = "19";
        this.cont.appendChild(textarea);
    
        var btn = document.createElement("button");
        btn.innerHTML="UPDATE";
        btn.onclick = (ev) => this.updateThread(this.board.username, this.board.password, input.value, textarea.value, host);
        this.cont.appendChild(btn);


    }

    updateThread(username, password, naslov, tekst, host)
    {

        if(username===null || username===undefined || username==="")
        {
            alert("Login!");
            return;
        }
        if(password===null || password===undefined || password==="")
        {
            alert("Login!");
            return;
        }
        if(naslov===null || naslov===undefined || naslov==="")
        {
            alert("unesite naslov");
            return;
        }
        if(tekst===null || tekst===undefined || tekst==="")
        {
            alert("unesite tekst");
            return;
        }

        fetch("https://localhost:5001/Thread/UpdateThread/",
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {   
                    "id" : this.id,
                    "naslov" : naslov,
                    "tekst" : tekst,
                    "user" :
                    {
                        "username":username,
                        "sifra": password
                    }
                }
            )

        }).then(response =>{

            if(response.ok)
            {
                host.removeChild(this.cont);
                this.cont = document.createElement("div");
                this.cont.innerHTML = "Thread je update-ovan";
                host.appendChild(this.cont);
            }
            else
            {
                alert("Doslo je do greske");
            }
        });
    }

    crtajDeleteThread(host)
    {
        this.cleanPage(host);

        this.cont = document.createElement("div");
        this.cont.className = "deleteThreadForm";
        this.cont.className += " Form";
        host.appendChild(this.cont);

        var label = document.createElement("label");
        label.innerHTML = "Please enter your username and password to remove thread:"
        this.cont.appendChild(label);

        var username = document.createElement("input");
        username.type = "text";
        username.value = "usename";
        this.cont.appendChild(username);

        var password = document.createElement("input");
        password.type = "password";
        password.value = "password";
        this.cont.appendChild(password);

        var btn = document.createElement("button");
        btn.innerHTML="DELETE";
        btn.onclick = (ev) => this.deleteThread(username.value, password.value, host);
        this.cont.appendChild(btn);

    
    }

    deleteThread(username, password, host)
    {   
        if(username===null || username===undefined || username==="")
        {
            alert("unesite username");
            return;
        }
        if(password===null || password===undefined || password==="")
        {
            alert("unesite password");
            return;
        }

        fetch("https://localhost:5001/Thread/DeleteThread/"+this.id,
        {

            method:"DELETE",           
            
            headers:
            {
                "Content-Type":"application/json"
            },

            body:JSON.stringify(
                {   
        
                    "username" : username,
                    "sifra" : password
                
                }
            )
        }).then(response => {
            if(response.ok)
            {
                host.removeChild(this.cont);
                this.cont = document.createElement("div");
                this.cont.innerHTML = "Thread je obrisan";
                host.appendChild(this.cont);
            }
            else
            {
                alert("Doslo je do greske");
            }
        });

        
    }

    cleanPage(host)
    {
        while (host.lastElementChild)
        {
            host.removeChild(host.lastElementChild);
        }
    }
}

