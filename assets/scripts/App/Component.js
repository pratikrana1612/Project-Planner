export class Component
{
    constructor(hostElementId,insertBefore = false)
    {
        if(hostElementId)
        {
            this.hostElement = document.getElementById(hostElementId);
        } 
        else
        {
            this.hostElement= document.body;
        }
        this.insertBefore = insertBefore;
        // console.log(this);
    }
    remove ()
    {
        if(this.element)
        {
            // console.log(this);
            this.element.remove();
        };
    }
    show()
    {
        // document.body.append(this.element);
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend',
            this.element
        )
        // console.log(this);
    }
}