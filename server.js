const express=require('express');


const app=express() // call the express function

const { userJoin , getcurrentUser, giveList,getRoomUsers,userLeave}=require('./public/js/users');

const port=process.env.Port || 3000 

app.use(express.static('public')) // use file present on public to show.(index.html)





const server=app.listen(port, () => {
  console.log(`listing on ${port}`);
})

const io=require('socket.io')(server) //passes io to server



io.on('connection',(socket) => {
  
  socket.on('joinRoom',({username,room}) => {
    const user =userJoin(socket.id,username,room);
    socket.join(user.room);

    socket.emit('message','Welcome to ChatApp');

    let data={
      username:user.username,
      comment:' Has Joined the Chat'
    }
    socket.broadcast.to(user.room).emit('new_user',data);

    socket.on('comment',(data) => {
      data.time=Date();
     socket.broadcast.to(user.room).emit('comment',data)
    })
     
    socket.on('list',() => {
    const user=getcurrentUser(socket.id);
    let arr=giveList();
    const array=getRoomUsers(user.room);
    io.to(user.room).emit('list',array);

  });

  socket.on('typing',(data) => {
    socket.broadcast.to(user.room).emit('typing',data)
  })

  socket.on('disconnect',() => {
    const user = userLeave(socket.id);
    if (user) {
      let data={
        username:user.username,
        comment:' Has left the Chat'
      }
      io.to(user.room).emit('user_left',data);
     
    }

    io.to(user.room).emit('remove',user.username);
    const array=getRoomUsers(user.room);
    io.to(user.room).emit('list',array);
  });
  
  });

  
})