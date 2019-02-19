const express = require('express')
const app = express()
const socketIO = require('socket.io')

const http = require('http')
let server = http.createServer(app)

const path = require('path')
const os = require('os')

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve(__dirname, 'public')))


const PORT = process.env.PORT || 3000

let io = socketIO(server)

// io.onconnection()

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    socket.emit('saludo', 'Hola usuario')
    
    socket.on('msg', (msg) => {
        console.log(msg);
    })


    // EVENTOS DE MOVIMIENTO

    socket.on('move_up', (data) => {
        console.log(data);
    })

    socket.on('move_down', (data) => {
        console.log(data);
    })

    socket.on('move_left', (data) => {
        console.log(data);
    })

    socket.on('move_right', (data) => {
        console.log(data);
    })
})



server.listen(PORT, () => {
    console.log('Server running');
})

// let interfaces = os.networkInterfaces()
// let addresses = []

// for (let k in interfaces) {
//     for (let k2 in interfaces[k]) {
//         let address = interfaces[k][k2];
//         if (address.family === 'IPv4' && !address.internal) {
//             addresses.push(address.address);
//         }
//     }
// }
