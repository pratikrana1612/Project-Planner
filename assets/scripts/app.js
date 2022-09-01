class ToolTip{}


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
    constructor(id,updateProjectListsFunction,type)
    {
        this.id=id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
    }

    connectMoreInfoButton()
    {

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