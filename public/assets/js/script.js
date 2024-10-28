const sendMessage = document.getElementById("sendMessage");
const chanel = document.getElementById('chanel');
const users = document.getElementById("users");

const queryString = window.location.search;
const urlSearchParams = new URLSearchParams(queryString);
const pseudo = urlSearchParams.get("pseudo");
console.dir(pseudo);

const socket = io();
// Fonctions 
function displayMessage(textContent,pseudo,date) {
  return ` <div class="post">
        <p class="txtContent">${textContent}</p>
        <p class="pseudo">${pseudo}</p>
        <p class="date">${date}</p>
    </div>`
};



tinymce.init({
    selector: '#message',
    plugins: [
      'a11ychecker','advlist','advcode','advtable','autolink','checklist','markdown',
      'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
      'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
    ],
    toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
  });

sendMessage.addEventListener("click", () =>{
  let message = tinyMCE.get('message').getContent();
  console.log(message);
  socket.emit('newGlobalMessage',{
    newGlobalMessage:message,
    pseudo:pseudo,
    date:new Date()
  });
  chanel.innerHTML += displayMessage(message,pseudo,new Date())
  tinyMCE.get('message').setContent("");
});

socket.on('init',(data)=>{
  console.dir(data);
});
socket.on('newGlobalMessageForAll', (data)=>{
  console.dir(data.newGlobalMessage);
  chanel.innerHTML += displayMessage(data.newGlobalMessage,data.pseudo,data.date) 
});
socket.on('clienListUpdate',(data)=>{
  console.dir(data);
});