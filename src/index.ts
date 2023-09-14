const greeter = (person: string) => {
    return `Hello, ${person}!`;
}

function testGreeter() {
    const user = 'Grant';
    Logger.log(greeter(user));
    return greeter(user);
}

function test() {
    return testGreeter()
}