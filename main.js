const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)


function deleteUser(users, deleteUser){//function to delete user from users array
  for (let i=0;i<users.length;i++){
    if(users[i] == deleteUser){
        users.splice(i,1)
    }
  }
  return users
}

app.use(express.static('static'))

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/index.html')
})

let users = []
let quotes = []
let authors = []

io.on('connection', (socket)=>{

  socket.on('joined', (username)=>{
    users.push(username)
    socket.username = username
    io.emit('joined', users)
    console.log(users)
  })
  socket.on('start', ()=>{
    io.emit('start')
  })
  socket.on('get quotes', (clientQuotes)=>{
    quotes = clientQuotes.quotes
    authors = clientQuotes.authors
    console.log(quotes)
    io.emit('get quotes', {quotes: quotes, authors: authors})

  })

  socket.on('user progress', (progress)=>{
    io.emit('user progress', {progress: progress*100,username: socket.username})
  })

    socket.on('disconnect', ()=>{
      io.emit('left', socket.username)
      users = deleteUser(users, socket.username)
      console.log(users)
    })

    socket.on('game over',()=>{
      io.emit('game over', socket.username)
    })
})

http.listen(3000, ()=>{
  console.log("Server started at port 3000!")
})
