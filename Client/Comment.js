
export class Comment
{

    constructor(id, tekst, user)
    {
        this.id = id;
        this.tekst = tekst;
        this.user = user;
        this.cont = null;
    }

    crtaj(host)
    {
        this.cont = document.createElement("div");
        this.cont.className = "comment";
        host.appendChild(this.cont);
        this.cont.onclick = (ev) => this.singleThread(host);
        
        var el = document.createElement("p");
        el.innerHTML="Commented by: " + this.user;
        this.cont.appendChild(el);

        el = document.createElement("p");
        el.innerHTML=this.tekst;
        this.cont.appendChild(el);
    }

}