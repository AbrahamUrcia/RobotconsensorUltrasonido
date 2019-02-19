const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')
const path = require('path')
const os = require('os')

app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')))

app.listen('3000', () => {
    console.log('Server running');
})

let interfaces = os.networkInterfaces()
let addresses = []

for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(interfaces);
console.log(addresses);