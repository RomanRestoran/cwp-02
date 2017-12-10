const net = require('net');
const fs = require('fs');
let sleep =require('sleep-ms');
const nessString = 'QA';
const clshutdown = 'DEC';
const claccepted = 'ACK';
const port = 8124;
let serverANSW;
let questions = require('./qa.json');
let i=1;

let shuffle = require('shuffle-array');




const server = net.createServer((client) => {
    let logg = fs.createWriteStream('serverlogger'+(i++)+'.log');
console.log('Client connected');
client.setEncoding('utf8');
client.id = Date.now();


client.on('data', (data, err) => {
    if (err) {
        console.log(err.message.toString());
    }
    else if (data.toString() === nessString.toString()) {
    console.log(data);

    console.log(claccepted + `,client №` + client.id + ` accepted`);
    logg.write(claccepted + `,client №` + client.id + ` accepted` + '\n');
    client.write(claccepted);
}
else if (data.toString() !== nessString.toString()) {
    let answer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    for (let i = 0; i < questions.length; i++) {
        if (data.toString() === questions[i].qn) {
            if (answer.toString() === '0') serverANSW = questions[i].answerNO;
            else if (answer.toString() === '1') serverANSW = questions[i].answerYES;
        }
    }
    console.log('Client\'s question: ' + data + '. Answer: ' + serverANSW + ' (1-yes,0-no)');
    logg.write('Client\'s question: ' + data + '. Answer: ' + serverANSW + ' (1-yes,0-no)' + '\n');

    client.write(serverANSW.toString());
}
});

client.on(`end`, () => {
    console.log(`Client №` + client.id + ` disconnected`);
logg.write(`Client №` + client.id + ` disconnected` + '\n');
});
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Server listening on localhost:${port}`);
});
