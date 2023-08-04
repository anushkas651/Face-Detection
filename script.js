const video= document.getElementById("video" )

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startWebcam);

function startWebcam(){
  navigator.mediaDevices
  .getUserMedia({
    video:true,
    audio:false,
  })
  .then((stream)=>{
    video.srcObject = stream;
    }).catch((error) => {
      console.error(error);
    });
}


video.addEventListener('play',()=>{

     const canvas=faceapi.createCanvasFromMedia(video)
     document.body.append(canvas);
     faceapi.matchDimensions(canvas,{height:video.height , width:video.width});

     setInterval(async()=>{
       const detections=await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        const resizeDetections= faceapi.resizeResults(detections,{height:video.height , width:video.width});


        canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.heigth)
        faceapi.draw.drawDetections(canvas,resizeDetections);
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetections);

          console.log(detections);
     },100);
    
});