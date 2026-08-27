const videoElm = document.querySelector('.video-elm');
const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
const link = document.querySelector('.download-link');
startBtn.addEventListener('click',async ()=>{
  let chunks = [];
  toggleDisable();
  const stream = await navigator.mediaDevices.getDisplayMedia();
  videoElm.srcObject = stream;
  const recorder = new MediaRecorder(stream);
  recorder.start();
  const [video] = recorder.stream.getVideoTracks();
  video.addEventListener('ended',()=>{
    recorder.stop();
  });
  recorder.ondataavailable = function(e){
    chunks.push(e.data);
  }
  recorder.onstop = function (){
    const blob = new Blob(chunks, {type:"video/mp4"});
    const url = URL.createObjectURL(blob);
    videoElm.src = url;
    videoElm.srcObject = null;
    link.innerText = "Downlaod"
    link.href = url;
    link.download = "video.mp4";
  }
  videoElm.play();
stopBtn.addEventListener('click',()=>{
  toggleDisable();
  recorder.stop();
  recorder.stream.getVideoTracks().forEach((track)=>{
    track.stop();
    stream = null;
  })
})
});
function toggleDisable(){
  if(startBtn.disabled){
    startBtn.disabled = false;
    stopBtn.disabled = true;
  } else{
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }
}
