const greeter = (person: string) => {
    return `Hello, ${person}!`;
}

function testGreeter() {
    const user = 'Brittany';
    Logger.log(greeter(user));
    return greeter(user);
}

// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html');
}

// @ts-ignore
global.appScriptTest = () => {
    return testGreeter()
}