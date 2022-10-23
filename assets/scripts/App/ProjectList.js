class ProjectList{
    projects = [];
    constructor(type)
    {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        // console.log(prjItems);
        for(const prjItem of prjItems){
            this.projects.push(new ProjectItem(prjItem.id,this.switchProject.bind(this),this.type));
        }
        this.connectDroppable();
        // console.log(this.projects);
    }

    connectDroppable()
    {
        const list = document.querySelector(`#${this.type}-projects ul`);
        list.addEventListener('dragenter',event=>{
            if(event.dataTransfer.types[0] === 'text/plain')
            {
                event.preventDefault();
                list.parentElement.classList.add('droppable');
            }
        });
        list.addEventListener('dragover',event=>{
            if(event.dataTransfer.types[0] === 'text/plain')
            {
                event.preventDefault();
                list.parentElement.classList.add('droppable');
            }
        });

        list.addEventListener('dragleave',event =>
        {
            // console.log(event.relatedTarget);
            if(event.relatedTarget.closest(`#${this.type}-projects ul`) !== list)
            {
                list.parentElement.classList.remove('droppable');
            }
        })

        list.addEventListener('drop',event =>
        {
            const prjId = event.dataTransfer.getData('text/plain')
            if(this.projects.find(p => p.id === prjId))
            {
                return;
            }
            document.getElementById(prjId).querySelector('button:last-of-type').click();
            list.parentElement.classList.remove('droppable');
            event.preventDefault();//not needed
        })
    }
    setSwitchHandlerFunction(setSwitchHandlerFunction)
    {
        this.switchHandler = setSwitchHandlerFunction;
    }
    addProject(project)
    {
       this.projects.push(project);
       DOMHelper.moveElement(project.id,`#${this.type}-projects ul`);
       project.update(this.switchProject.bind(this),this.type);
    }
    switchProject(projectId)
    {
        // const projIndex = this.projects.findIndex(p => p.id === projectId);
        // this.projects.splice(projIndex,1);
        this.switchHandler(this.projects.find(p => p.id === projectId));    
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}