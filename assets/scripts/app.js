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
        this.cloaseNotifierHandler();
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

    constructor(cloaseNotifier)
    {
        super('active-projects',true);
        this.cloaseNotifierHandler = cloaseNotifier;
        this.create();
    }
    create()
    {
        const tooltipElement = document.createElement('div');
        tooltipElement.className= 'card';
        tooltipElement.textContent = 'Dummy!';
        tooltipElement.addEventListener('click',this.remove);
        this.element= tooltipElement;
    }
}


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
        if(this.hasActiveToolTip)
        {
            return;
        }
        const Tooltip = new ToolTip(() =>
        {
            this.hasActiveToolTip = false;
        });
        Tooltip.show();
        this.hasActiveToolTip=true;
    }
    connectMoreInfoButton()
    {
        const ProjectItemElement = document.getElementById(this.id);
        // console.log(document.getElementById(this.id));
        const moreInfoBtn = ProjectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click',this.showMoreInfoHandler);
    }
    connectSwitchButton(type)   
    {
        const projItemEle = document.getElementById(this.id);
        let switchBtn = projItemEle.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent= type==='Active'?'Finished':'Active';
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