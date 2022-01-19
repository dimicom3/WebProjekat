import { Board } from "./board.js";
export class Category
{
    constructor(id, naziv)
    {
        this.id = id;
        this.naziv = naziv;
        this.cont = null
    }

    crtaj(host)
    {
        this.cont = document.createElement("div")
        host.appendChild(this.cont);
        this.cont.className = "Category";
        this.cont.innerHTML = this.naziv;

    }
    
}