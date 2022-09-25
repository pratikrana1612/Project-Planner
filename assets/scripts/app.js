class DOMHelper
{
    static clearEventListeners(element)
    {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
    static moveElement(elementId,newDestinationSelector)
    {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({behavior:'smooth'});
    }
}



class Component
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



class ToolTip extends Component{

    constructor(cloaseNotifier,toolTipText,hostElementId)
    {
        // super('active-projects',true);
        super(hostElementId);
        // console.log(cloaseNotifier);
        this.cloaseNotifierHandler = cloaseNotifier;
        // console.log(this.cloaseNotifierHandler);
        this.text = toolTipText;
        this.create();
    }
    closeToolTip()
    {
        this.remove();
        this.cloaseNotifierHandler();
    }
    create()
    {
        const tooltipElement = document.createElement('div');
        tooltipElement.className= 'card';
        // tooltipElement.textContent = this.text;

        const toolTipTemplate = document.getElementById('tooltip');
        const toolTipBody = document.importNode(toolTipTemplate.content,true);
        toolTipBody.querySelector('p').textContent = this.text;
        tooltipElement.append(toolTipBody);

        // console.log(this.hostElement.getBoundingClientRect());
        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElPosHeight = this.hostElement.clientHeight;
        const scrollFromTop = this.hostElement.parentElement.scrollTop;
        // console.log( this.hostElement.parentElement.scrollTop);
        const x = hostElPosLeft;
        const y = hostElPosTop + hostElPosHeight - scrollFromTop - 10;
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px';
        tooltipElement.style.top = y + 'px';
        tooltipElement.addEventListener('click',this.closeToolTip.bind(this));
        this.element= tooltipElement;
    }
}



class ProjectItem{
    hasActiveToolTip = false;
    constructor(id,updateProjectListsFunction,type)
    {
        this.id=id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
        this.connetDrag();
    }

    showMoreInfoHandler()
    {
        const ele = document.getElementById(this.id);
        // console.log(ele.dataset);
        // ele.dataset.someInfo = 'test';
        const toolTipText = ele.dataset.extraInfo;
        if(this.hasActiveToolTip)
        {
            return;
        }
        const Tooltip = new ToolTip(() =>
        {
            this.hasActiveToolTip = false;
        },toolTipText,this.id);
        console.log(Tooltip);
        Tooltip.show();
        this.hasActiveToolTip=true;
    }
    connectMoreInfoButton()
    {
        const ProjectItemElement = document.getElementById(this.id);
        // console.log(document.getElementById(this.id));
        const moreInfoBtn = ProjectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click',this.showMoreInfoHandler.bind(this));
    }

    connetDrag()
    {
        document.getElementById(this.id).addEventListener('dragstart',event =>{
            event.dataTransfer.setData('text/plain',this.id);
            event.dataTransfer.effectAllowed= 'move';
        });
        document.getElementById(this.id).addEventListener('dragend',event =>{
            console.log(event);
            // event.target.parentElement.style.backgroundColor='red';
        });


    }
    connectSwitchButton(type)  
    {
        const projItemEle = document.getElementById(this.id);
        let switchBtn = projItemEle.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent= type === 'active'?'Finish':'active';
        // switchBtn.addEventListener('click')
        switchBtn.addEventListener('click',this.updateProjectListsHandler.bind(null,this.id));
    }

    update(updateProjectListFn,type){
        this.updateProjectListsHandler = updateProjectListFn;
        this.connectSwitchButton(type);
    }
}

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

class App{
    static init()
    {
        const activeProjectsList = new ProjectList('active');
        console.log(activeProjectsList)
        const FinishedProjectsList = new ProjectList('finished');
        console.log(FinishedProjectsList)
        activeProjectsList.setSwitchHandlerFunction(FinishedProjectsList.addProject.bind(FinishedProjectsList));
        FinishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList));
        document.getElementById('foooter_btn').addEventListener('click',this.startAnalytics);
    }

    static startAnalytics()
    {
        const sc = document.createElement('script');
        sc.src = 'assets/scripts/Analytics.js';
        sc.defer = true;
        document.head.append(sc);
    }
}

App.init();
// const sc = document.createElement('script');
// sc.textContent = "alert('hello world')";
// document.body.append(sc);