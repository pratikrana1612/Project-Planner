import { Component } from "./Component.js";;

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