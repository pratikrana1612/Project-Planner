class ToolTip{}


class DOMHelper
{
    static moveElement(elementId,newDestinationSelector)
    {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }
}
class ProjectItem{
    constructor(id,updateProjectListsFunction)
    {
        this.id=id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton();
    }

    connectMoreInfoButton()
    {

    }
    connectSwitchButton()   
    {
        const projItemEle = document.getElementById(this.id);
        const switchBtn = projItemEle.querySelector('button:last-of-type');
        switchBtn.addEventListener('click',this.updateProjectListsHandler.bind(null,this.id));
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
            this.projects.push(new ProjectItem(prjItem.id,this.switchProject.bind(this)));
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
        const FinishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(FinishedProjectsList.addProject.bind(FinishedProjectsList));
        FinishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList));
    }
}

App.init();