const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const peer = new Peer();

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
  addVideo(myVideo, stream)

  peer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');

    call.on('stream', userVideo => {
      
      addVideo(video, userVideo);
    });
  });
  
  socket.on('video-connected', userId => {
     connectToNewUser(userId, stream) 
  });
});

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream){
  const call = peer.call(userId, stream);

  const video = document.createElement('video');
  call.on('stream', userVideo => {
    addVideo(video, userVideo);
  });

  call.on('closer', () => {
    video.remove();
  });
};

function addVideo(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
};

