const users=[];
function userJoin(id,username,room)
{
    const user ={id,username,room};
    users.push(user);
    return user;
}

function getcurrentUser(id)
{
    return users.find(user=>user.id===id);
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }

function giveList()
{
    return users;
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      let user=users.splice(index,1)[0];
      return user;
    }
  }



module.exports={
    userJoin,
    getcurrentUser,
    giveList,
    getRoomUsers,
    userLeave
};