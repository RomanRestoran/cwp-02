const net = require('net');
const shuffle = require('shuffle-array');
const sleep = require('sleep-ms');
const fs = require('fs');
const clString = 'QE';
const clshutdown = 'DEC';
const claccepted = 'ACK';
let trigger = null;
let curQuest;
let ind = -1;
let questions = require('./qa.json');
const isNull = require("util").isNull;


const client = new net.Socket();
client.port = 8124;
client.setEncoding('utf8');

client.connect(client.port, '127.0.0.1', function () {

    console.log(`Connected`);
    shuffle(questions);
    client.write(clString);
});

client.on('data', function (data) {
    if (data === claccepted) trigger = true;
    if (data === clshutdown && isNull(trigger)) client.destroy();

    if (data.toString() === claccepted.toString() && trigger === true) {
        console.log('Server connection answer: ' + data.toString() + '. (ACK-connection allowed,DEC-connection refused)');

        if (ind < questions.length - 1) {

            curQuest = questions[++ind].qn;
            client.write(curQuest);
        }
        else {
            client.destroy();
        }
    }
    else if (data.toString() !== claccepted.toString() && trigger === true) {
        console.log(questions[ind].qn);
        console.log('Answer: ' + questions[ind].answerYES);
        console.log('Server\'s answer: ' + data.toString());
        if (ind < questions.length - 1) {

            curQuest = questions[++ind].qn;
            client.write(curQuest);
        }
        else {
            client.destroy();
        }
    }

});

client.on('close', function () {
    console.log(`Connection closed`);
});
