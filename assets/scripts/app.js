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
        sc.src = 'assets\scripts\Utility\Analytics.js';
        sc.defer = true;
        document.head.append(sc);
    }
}

App.init();
// const sc = document.createElement('script');
// sc.textContent = "alert('hello world')";
// document.body.append(sc);