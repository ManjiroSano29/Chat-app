const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const myName = prompt('what is your name?');

socket.emit('new-user', myName);

socket.on('user-connected', myName => {
  messUser(`${myName} connected`);
})

socket.on('user-disconnected', myName => {
  messUser(`${myName} disconnected`);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const message = input.value;
  if (input.value) {
    socket.emit('chat message', {myName, message});
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = `${msg.myName}: ${msg.message}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

function messUser(mess){
  const messElem = document.createElement('div');
  messElem.innerText = mess;
  messages.append(messElem);
}