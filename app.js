const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const userList = {}
let count = 1

io.on('connection', (socket) => {
    console.log(socket.id, '연결됨.')

    socket.on('send users', (nickname) => {
        if (nickname === '익명') {
            nickname += count
            count++
        }
        userList[socket.id] = nickname
        const nicknames = Object.values(userList)
        io.emit('receive users', nicknames)
    })

    socket.on('send message', (name, text) => {
        const msg = name + ': ' + text
        console.log(msg)
        io.emit('receive message', msg)
    })

    socket.on('disconnect', () => {
        delete userList[socket.id]
        const nicknames = Object.values(userList)
        io.emit('receive users', nicknames)
        console.log(socket.id, '해제됨.')
    })    
})

http.listen(8080, () => {
    console.log('8080 포트 ON')
})