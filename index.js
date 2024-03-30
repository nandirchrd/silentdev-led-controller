const { exec } = require('child_process');
const { networkInterfaces } = require('os');
const { Board, Led, Pin } = require('johnny-five');
const { Server } = require('socket.io');

const host = networkInterfaces()["Wi-Fi"][1].address || 'localhost';
const board = new Board({port: "COM3", repl: false});
const io = new Server({cors: "*"});

let isLedOn = false;

board.on('ready', ()=>{
    exec(`live-server ./view --host=${host}`);

    const led = new Led(2);
    const buzzer = new Pin(3);

    io.on('connection', (socket)=>{
        console.log(`${socket.id} connected!`);

        socket.emit('update', isLedOn);
        socket.on('led', isOn=>{
            if(isOn){
                led.on();
                buzzerSound(buzzer);
            }else{
                led.off();
                buzzerSound(buzzer);
            }
            isLedOn = isOn;
            socket.broadcast.emit('update', isOn);
        })
    })
    io.listen(3000)
})

function buzzerSound(buzzer){
    buzzer.high();
    setTimeout(()=>buzzer.low(), 100);
}