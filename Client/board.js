import {Thread} from "./Thread.js"
import { Category } from "./Category.js";


export class Board{
    constructor()
    {
        this.threadList = null;//za brisati
        this.header = null;
        this.cont = null;//body
        this.username = null;
        this.password = null;
    }

    //main
    crtaj(host)
    {   
        //this.crtajHeader(host);
        //header svakako
        this.header = document.createElement("div");
        this.header.className = "header";
        host.appendChild(this.header);
        
        var home = document.createElement("div");
        home.innerHTML="Home";
        home.className="headerBtn";
        this.header.appendChild(home);

        var postThread = document.createElement("div");
        postThread.innerHTML="Post Thread";
        postThread.className="headerBtn";
        this.header.appendChild(postThread);

        var login = document.createElement("div");
        login.innerHTML="Login";
        login.className="headerBtn";
        this.header.appendChild(login);
        
        var register = document.createElement("div");
        register.innerHTML="Register";
        register.className="headerBtn";
        this.header.appendChild(register);

        var addCategory = document.createElement("div");
        addCategory.innerHTML="Add Category";
        addCategory.className="headerBtn";
        this.header.appendChild(addCategory);        
        //!header


        //body
        this.cont = document.createElement("div");
        this.cont.className="mainContainer";
        host.appendChild(this.cont);


        //!body
        //samo jednom 
        this.crtajKategorije();
        //
        home.onclick = (ev) => this.crtajKategorije();
        postThread.onclick = (ev) => this.crtajPostThread();
        register.onclick = (ev) => this.crtajRegisterUser();
        addCategory.onclick = (ev) => this.crtajDodajKategorije();
        login.onclick = (ev) => this.crtajLogin(login);
    }


    crtajRegisterUser()
    {
        //ocisti page
        this.cleanPage(this.cont);


        var div = document.createElement("div");
        div.className = "registerUserForm";
        div.className += " Form";
        this.cont.appendChild(div);
        

        var label = document.createElement("label");
        label.innerHTML = "Username:"
        div.appendChild(label);
        var username = document.createElement("input");
        username.type = "text";
        username.value = "username";
        div.appendChild(username);

        label = document.createElement("label");
        label.innerHTML = "Password:";
        div.appendChild(label);
        var sifra = document.createElement("input");
        sifra.type = "password";
        sifra.value ="sifra";
        div.appendChild(sifra);

        label = document.createElement("label");
        label.innerHTML = "Mail:";
        div.appendChild(label);
        var mail = document.createElement("input");
        mail.type = "text";
        mail.value = "mail";
        div.appendChild(mail);

        label = document.createElement("label");
        label.innerHTML = "Name:";
        div.appendChild(label);
        var ime = document.createElement("input");
        ime.type = "text";
        ime.value ="ime";
        div.appendChild(ime);

        label = document.createElement("label");
        label.innerHTML = "Surname:";
        div.appendChild(label);
        var prezime = document.createElement("input");
        prezime.type = "text";
        prezime.value = "prezime";
        div.appendChild(prezime);



        var btn = document.createElement("button");
        btn.innerHTML="Register";
        btn.onclick = (ev) => this.postUser(username.value, sifra.value, ime.value, prezime.value, mail.value);
        div.appendChild(btn);

    }

    postUser(username, sifra, ime, prezime, mail)
    {
    
        if(username===null || username===undefined || username==="")
        {
            alert("unesite username");
            return;
        }
        if(sifra===null || sifra===undefined || sifra==="")
        {
            alert("unesite password");
            return;
        }
        if(ime===null || ime===undefined || ime==="")
        {
            alert("unesite ime");
            return;
        }
        if(prezime===null || prezime===undefined || prezime==="")
        {
            alert("unesite prezime");
            return;
        }
        if(mail===null || mail===undefined || mail==="")
        {
            alert("unesite mail");
            return;
        }

        fetch("https://localhost:5001/User/PostUser", {
            method:"POST",
            headers: 
            {
                "Content-Type":"application/json"
            },
            body:
            JSON.stringify(
                {
                    "userName":username,
                    "mail":mail,
                    "sifra":sifra,
                    "ime":ime,
                    "prezime":prezime
                }
            )
        })
        .then(p => {
           
            if(p.ok)
                alert("Korisnik je uspesno dodat");
            else
                alert("Doslo je do greske");
            
        });


    }



    crtajKategorije()
    {
        //ocisti page
        this.cleanPage(this.cont);

        var categoryList = [];
        
        //crtaj
        fetch("https://localhost:5001/Category/GetAllCategories")
        .then(p => 
        {
            if(p.ok)
            {
                p.json().then(categories => 
                {
                    categories.forEach(category => 
                    {
                        let c = new Category(category.id, category.naziv);

                        categoryList.push(c);
                        c.crtaj(this.cont);
                        c.cont.onclick = (ev) => this.getThreadsByCategory(c.id);
                    });
                });
            }
        });



    }

    crtajDodajKategorije()
    {
        this.cleanPage(this.cont);

        var div = document.createElement("div");
        div.className = "Form";
        this.cont.appendChild(div);
        var label = document.createElement("label");
        label.innerHTML = "Category name:"
        div.appendChild(label);

        var name = document.createElement("input");
        div.appendChild(name);

        label = document.createElement("button");
        label.onclick = (ev) => this.postCategory(name.value);
        label.innerHTML = "Add new category";
        div.appendChild(label);
        //koristim label da dodam btn;

    }

    postCategory(name)
    {
        if(name===null || name===undefined || name==="")
        {
            alert("unesite naziv kategorije");
            return;
        }

        fetch("https://localhost:5001/Category/PostCategory",{
            method : "POST",
            headers :
            {
                "Content-type":"application/json"
            },
            body: JSON.stringify( 
            {
                "naziv": name
            })
        }).then(response =>
            {
                if(response.ok)
                {
                    alert("Kategorija je uspesno dodata");
                    this.crtajKategorije();
                }
                else
                {
                    alert("Doslo je do greske");
                }
            });
    }

    getThreadsByCategory(catId)
    {

        var threadList = [];

        fetch("https://localhost:5001/Category/GetThreadListByCategory/" + catId)
        .then(p => {
            if(p.ok)
            {  
                p.json().then(threadListByCategory => {
                    if(threadListByCategory == null) 
                    {
                        return;
                    }
                    threadListByCategory.forEach(thread => {
                        let t = new Thread(thread.id, thread.naslov, this);
                        threadList.push(t);                
                    });

                    this.crtajThreadList(threadList);
                });
            }
        });
    }

    crtajPostThread()
    {
        //ocisti page
        this.cleanPage(this.cont);

        //crtanje
        var el;
        var div = document.createElement("div");
        div.className = "postThreadForm";
        div.className += " Form";
        this.cont.appendChild(div);
        
        var label = document.createElement("label");
        label.htmlFor = "categoryList";
        label.innerHTML = "Category:"
        div.appendChild(label);
        var categoryList = [];
        var categorySelect = document.createElement("select");
        categorySelect.id = "categoryList"
        div.appendChild(categorySelect);

        fetch("https://localhost:5001/Category/GetAllCategories")
        .then(p => 
        {
            if(p.ok)
            {
                p.json().then(categories => 
                {
                    categories.forEach(category => 
                    {
                        let c = new Category(category.id, category.naziv);

                        categoryList.push(c);

                        let el = document.createElement("option");
                        el.value = c.id;
                        el.innerHTML = c.naziv;
                        categorySelect.appendChild(el);

                    });
                });   
            }
        });

        label = document.createElement("label");
        label.innerHTML = "Title:"
        div.appendChild(label);
        var naslov = document.createElement("input");
        naslov.type = "text";
        naslov.value = "Naslov";
        div.appendChild(naslov);
      
        label = document.createElement("label");
        label.innerHTML = "Text:"
        div.appendChild(label);
        var textarea = document.createElement("textarea");
        textarea.value="tekst";
        textarea.maxLength = "1000";
        textarea.cols = "27";
        textarea.rows = "19";
        div.appendChild(textarea);

        el = document.createElement("button");
        el.innerHTML="POST";
        el.onclick = (ev) => this.postThread(naslov.value, textarea.value, this.username, this.password, categorySelect.value, div);
        div.appendChild(el);


        

    }

    postThread(naslov, tekst, username, sifra, categoryID, host)
    {   
        console.log(this.username);
        if(username===null || username===undefined || username==="")
        {
            alert("Login!");
            return;
        }
        if(sifra===null || sifra===undefined || sifra==="")
        {
            alert("login!");
            return;
        }
        if(tekst===null || tekst===undefined || tekst==="")
        {
            alert("unesite text");
            return;
        }
        if(naslov===null || naslov===undefined || naslov==="")
        {
            alert("unesite naslov");
            return;
        }
        if(categoryID===null || categoryID===undefined || categoryID==="")
        {
            alert("unesite categoryID");
            return;
        }


        //console.log(naslov, "+", tekst, "+", username, "+", sifra, "+", categoryID)
        fetch("https://localhost:5001/Thread/PostUserThread/",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {   
                    "naslov" : naslov,
                    "tekst" : tekst,
                    "user":
                    {
                        "username":username,
                        "sifra": sifra
                    },
                    "category":
                    {
                        "id": categoryID
                    }
                }
            )

        }).then(response => {
            if(response.ok)
            {
                alert("Thread je uspesno objavljen");
                this.crtajKategorije();
            }
            else
            {
                alert("Doslo je do greske");
            }    
        });
    }


    crtajThreadList(threadList)
    {   

        this.cleanPage(this.cont);

        threadList.forEach(thread => {
            thread.crtaj(this.cont);
        });

    }

    crtajLogin(btnLog)
    {
        this.cleanPage(this.cont);

        var div = document.createElement("div");
        div.className = "postThreadForm";
        div.className += " Form";
        this.cont.appendChild(div);

        var label = document.createElement("label");
        label.innerHTML = "Username:"
        label.htmlFor = "usernameForm";
        div.appendChild(label);
        var username = document.createElement("input");
        username.type = "text";
        username.value = "username";
        username.id = "usernameForm";
        div.appendChild(username);
        
        
        label = document.createElement("label");
        label.htmlFor = "passwordForm";
        label.innerHTML = "Password:"
        div.appendChild(label);
        var sifra = document.createElement("input");
        sifra.type = "password";
        sifra.value = "sifra";
        sifra.id = "passwordForm";
        div.appendChild(sifra);  

        var el = document.createElement("button");
        el.innerHTML="Login";
        el.onclick = (ev) => this.login(username.value, sifra.value, btnLog);
        div.appendChild(el);

    }


    login(username, sifra, btnLog)
    {
        if(username===null || username===undefined || username==="")
        {
            alert("unesite username");
            return;
        }
        if(sifra===null || sifra===undefined || sifra==="")
        {
            alert("unesite password");
            return;
        }
        fetch("https://localhost:5001/User/Login/",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {   
                    "username" : username,
                    "sifra" : sifra

                }
            )

        }).then(response => {
            if(response.ok)
            {
                response.json().then(usr => {
                    this.username = usr.userName;
                    this.password = usr.sifra;
                    console.log(this.username);
                });
                alert("Login uspesan");
                btnLog.innerHTML = "Logout";
                btnLog.onclick = (ev) => this.logout(btnLog);
                this.crtajKategorije();
            }
            else
            {
                alert("Doslo je do greske");
            }    
        });
    }

    logout(btnLog)
    {
        this.username = null;
        this.password = null;
        btnLog.innerHTML = "Login";
        btnLog.onclick = (ev) => this.crtajLogin(btnLog);
    }


    cleanPage(host)
    {
        while (host.lastElementChild)
        {
            host.removeChild(host.lastElementChild);
        }
    }


}