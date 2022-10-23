const button = document.querySelector('button');


// const buttonClickerHandler = (event) =>
// {
//     console.log("ho gaya")
//     event.target.disabled = true;
// }
const anotherClickHandler = () =>
{
    console.log("button is clicked");
}
// button.onclick = buttonClickerHandler;
// button.onclick = anotherClickHandler;
// const btn = buttonClickerHandler.bind(this);
// button.addEventListener('click',buttonClickerHandler);

// setTimeout(() => {
//     button.removeEventListener('click',btn)
// }, 2000);
let curElementNumber = 0;
 
// function scrollHandler() {
//     const distanceToBottom = document.body.getBoundingClientRect().bottom;
 
//     if (distanceToBottom < document.documentElement.clientHeight + 150) {
//         const newDataElement = document.createElement('div');
//         curElementNumber++;
//         newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
//         document.body.append(newDataElement);
//     }
// }
 
// window.addEventListener('scroll', scrollHandler);
const form=document.querySelector('form')
form.addEventListener('submit',(event) =>
{
    event.preventDefault();
    console.log(event);
})


document.querySelector('div').addEventListener('click',event =>
{
    console.log('CLICKED DIV');
    console.log(event);
})


button.addEventListener('click',function(event)
{
    event.stopPropagation(); //it will stop any parent element event listener and run only child event listent
    event.stopImmediatePropagation(); // it will stop any other event listener on the the this element
    console.log('CLICKED BUTTON');
    console.log(event);
    console.log(this);
})
// const lis = document.querySelectorAll('li');
// lis.forEach(li => {
//     li.addEventListener('click',event =>
//     {
//         event.target.classList.toggle('highlighted');
//     })
// })

const ul = document.querySelector('ul');

ul.addEventListener('click',function(event){
    // console.log(event);
    event.target.closest('li').classList.toggle('highlighted');
    button.click();
    console.log(this);
})







































































































