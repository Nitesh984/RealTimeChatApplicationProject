
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }); // get the data from url

  const store=[];
  
  const userlist=document.querySelector('.userlist');
  //Avatars
  function avatar(username)
  {
    const list=document.createElement('li');
    list.className='list';
    let img=document.createElement('img');
    img.classList='avatar';
    const url=`https://avatars.dicebear.com/api/micah/${username}.svg`;
    img.src=url;
    let h4=document.createElement('h5');
    h4.innerHTML=`${username}`;
    h4.classList='typing';
    list.append(img);
    list.append(h4);
    userlist.append(list);
    store.push(username);
    
  }


let socket=io()


socket.emit('joinRoom', { username, room });

const textarea=document.querySelector('#textarea');

const submitBtn=document.querySelector('#submit');

const commentbox=document.querySelector('.comment_box');

const chatArea=document.querySelector('#chatArea');

const column1=document.querySelector('.column1');

const Main=document.querySelector('#Main');

submitBtn.addEventListener('click',(e) => {
  e.preventDefault()
   const comment=textarea.value;
   console.log(comment.length)
   postcomment(comment);

})

function postcomment(comment)
{
    let data={
        username: username,
        comment: comment
    }
    if(data.comment.length!==0)
    {
    console.log(data.comment.length)
    appendToDom(data)
    textarea.value=' ';
    broadCastComment(data)
    }
}


socket.on('message',(message) => {
  let lTag=document.createElement('li');
    lTag.classList.add('comment','mb-3');
    let img=document.createElement('img');
    img.classList.add('Nameimg');
    img.src="img/Chatbot.png";
    commentbox.append(img);
    let samay="AM";
    let hour=parseInt(moment().format("HH:mm"));
    if(hour>11)
    {
      samay="PM";
    }
    let mark= `<div class="card border-light" mb-3>
    <div class="card-body">
        <div class="nameTime">
        <h6><strong>ChatBot</strong></h6>
        </div>
        <p>Welcome To ChatApp <strong>${username}</strong></p>
        <div class="Time"><i class="fa-solid fa-clock"></i><span> ${moment().format("HH:mm")} ${samay}</span></div>
    </div`
    lTag.innerHTML=mark
    commentbox.append(lTag)
    chatArea.scrollTop=chatArea.scrollHeight;
})

socket.on('new_user',(message) => {
  let lTag=document.createElement('li');
    lTag.classList.add('comment','mb-3');
    let img=document.createElement('img');
    img.classList.add('Nameimg');
    img.src="img/Chatbot.png";
    commentbox.append(img);
    let samay="AM";
    let hour=moment().format("HH:mm");
    if(hour>11)
    {
      samay="PM";
    }
    let mark= `<div class="card border-light" mb-3>
    <div class="card-body">
        <div class="nameTime">
        <h6><strong>ChatBot</strong></h6>
        </div>
        <p>${message.username} ${message.comment}</p>
        <div class="Time"><i class="fa-solid fa-clock"></i><span> ${moment().format("HH:mm")} ${samay}</span></div>
    </div`
    lTag.innerHTML=mark
    commentbox.append(lTag)
    chatArea.scrollTop=chatArea.scrollHeight;
})

socket.emit('list');

socket.on('list',(arr) => {
  userlist.innerHTML=' ';
  arr.forEach(element => {
    avatar(element.username)
  });
})





function appendToDom(data)
{
    let lTag=document.createElement('li');
    lTag.classList.add('comment','mb-3');
    let img=document.createElement('img');
    img.classList.add('Nameimg');
    const url=`https://avatars.dicebear.com/api/micah/${data.username}.svg`;
    img.src=url;
    commentbox.append(img);
    let samay="AM";
    let hour=parseInt(moment().format("HH:mm"));
    if(hour>11)
    {
      samay="PM";
    }

    let markup= `<div class="card border-light" mb-3>
    <div class="card-body">
        <div class="nameTime">
        <h6><strong>${data.username}</strong></h6>
        </div>
        <p>${data.comment}</p>
        <div class="Time"><i class="fa-solid fa-clock"></i><span> ${moment(data.time).format("HH:mm")} ${samay}</span></div>
    </div>
</div>`
  lTag.innerHTML=markup
  commentbox.append(lTag)
  chatArea.scrollTop=chatArea.scrollHeight;
}

function broadCastComment(data)
{

   socket.emit('comment',data)
}

socket.on('comment',(data) => {
   appendToDom(data);
})

textarea.addEventListener('keyup',(e) => {
  socket.emit('typing',{username})
})


let typingDiv=document.querySelector('.typing')


let timerId=null

function debounce(func,timer)
{
   if(timerId)
   {
    clearTimeout(timerId)
   }
   timerId=setTimeout(() => {
     func()
   },timer)
}
socket.on('typing',(data)=>{
typingDiv.innerHTML=`${data.username} is typing...`

debounce(function() {
    typingDiv.innerHTML=''
},1000)

})

textarea.addEventListener("keypress",(event) => {
  if(event.key==="Enter") 
  {
    submitBtn.click();
  }
})
 
// Room Name in list
const room_name=document.querySelector('#header_room');

const ele=document.createElement('h4');
if(room.length)
ele.innerHTML=`=>"${room}"`;
ele.classList='Room_insert';
room_name.append(ele);

//Prompt the user before leave chat room
document.getElementById('left_btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    socket.emit('dis_connect');
    window.location = 'index.html';
  } else {
  }
});


// Dark&light Mode
var val=0;
let checkbox=document.getElementById('chk');
checkbox.addEventListener('change',() => {
  let header=document.querySelector('header');
  let container=document.querySelector('.container');
  let column=document.querySelector('.column');
  let column1=document.querySelector('.column1');
  let label=document.querySelector('#lab');
  let userlist=document.querySelector('.userlist');
  let card=document.querySelector('.card');
  let leavebtn=document.querySelector('#left_btn');


  if(val===1){  //Dark Mode
  header.style.backgroundColor='rgb(35, 28, 41)';
  container.style.backgroundImage="url('img/darkMode.jpg')";
  document.querySelector('header h3').style.color='white';
  document.querySelector('#left_btn').style.backgroundColor='black';
  document.querySelector('#left_btn').style.color='white';
  container.style.backgroundColor='black';
  column.style.backgroundColor='white';
  column.style.color='black';
  column1.style.backgroundColor='white';
  column1.style.color='black';
  document.querySelector('#textarea').style.backgroundColor='black';
  column1.style.backgroundImage="url('img/darkWhatsappImg.webp')";
  column.style.backgroundColor="rgb(35, 28, 41)";
  column.style.backgroundImage='none';
  leavebtn.style.backgroundColor='rgba(255, 255, 255, 0.894)';
  document.querySelector('#header_room').style.color='rgba(255, 255, 255, 0.894)';
  leavebtn.style.color='black';
  document.querySelector('#user_header').style.color='rgba(255, 255, 255, 0.894)';
  userlist.style.color='white';
  document.querySelector("hr").style.color='white';
  val=0;
  }
  else
  {
    header.style.backgroundColor='rgb(255, 162, 162)';
    document.querySelector('header h3').style.color='black';
    document.querySelector('#left_btn').style.backgroundColor='white';
    document.querySelector('#left_btn').style.color='black';
    container.style.backgroundColor='white';
    column.style.backgroundColor='black';
    column.style.color='white';
    column1.style.backgroundColor='black';
    column1.style.color='white';
     column1.style.backgroundImage="url('img/whatsappbackgroundImg.png')";
     column.style.backgroundImage='none';
     column.style.backgroundColor='rgba(255, 255, 255, 0.894)';
     document.querySelector('#textarea').style.backgroundColor='white';
     userlist.style.color='black';
     document.querySelector('#header_room').style.color='black';
     leavebtn.style.backgroundColor='rgb(35, 28, 41)';
     leavebtn.style.color='white';
     document.querySelector('#user_header').style.color='black';
     document.querySelector('#textarea').color='black';
     document.querySelector("hr").style.color='black';
     val=1;
  }

})


socket.on('user_left',(data) => {
   const list=document.createElement('li');
   list.className='left';
   list.innerHTML=`${data.username} ${data.comment}`;
   commentbox.append(list);
   chatArea.scrollTop=chatArea.scrollHeight;
})


