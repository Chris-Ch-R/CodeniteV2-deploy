var cd = 0;
var shoot = 0;
const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo());

function startVideo() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then(
        stream => {
            video.srcObject = stream;
        }).catch(console.error);
}

video.addEventListener('play', () => {
    const displaySize = { width: video.width, height: video.height }
    var smile;
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        resizedDetections.forEach(result => {
            const {expressions} = result;
            smile = expressions.happy;
        })
        console.log(cd,shoot);
        if(cd==5){
            shoot=1;
            console.log(shoot);
            // unityInstance.SendMessage('MyCharacterController', 'Shoot', 0)
            cd=0;
            shoot=0;
        }else if(smile >= 0.90){
            cd = cd+1;
        } else{
            cd=0;
        }
    }, 1000)
});

// video.addEventListener('play', () => {
//     const canvas = faceapi.createCanvasFromMedia(video)
//     document.body.append(canvas)
//     const displaySize = { width: video.width, height: video.height }
//     faceapi.matchDimensions(canvas, displaySize)
//     setInterval(async () => {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
//         const resizedDetections = faceapi.resizeResults(detections, displaySize)
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
//         faceapi.draw.drawDetections(canvas, resizedDetections)
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

//         resizedDetections.forEach(result => {
//             const {expressions} = result
//             console.log(expressions.happy)
//         })

//     }, 100)
// });