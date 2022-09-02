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
    }
    remove ()
    {
        if(this.element)
        {
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
        tooltipElement.textContent = this.text;
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
        this.connectSwitchButton();
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
        // console.log(this.projects);
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
    }
}

App.init();