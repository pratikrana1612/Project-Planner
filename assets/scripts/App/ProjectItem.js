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