let w = 70;
let maxD;
let ma;
songIsPlaying = false;
buttonWasPressed = false;
lastSample = false;

function windowResized() {
    
    resizeCanvas(windowWidth * 0.59, windowWidth * 0.59);
    canvas.style.bottom = '15vh'
    canvas.style.left = '42vw'
    canvas.style.position = 'fixed'
  
    rLine = document.getElementById("insert-songs")
    rLine.style.top =  '-25vh';
    rLine.style.right = '15vw';
    rLine.style.width = '40vw';

    getInfo();
    deleteInfo();
    createInfo();

  }

function preload() {
    buttons = document.getElementById("buttons")
    var file = document.getElementById("thefile");
    context = new AudioContext();
    file.onchange = function() {
        
        buttonWasPressed = false;

        buttonPrev = document.getElementById("prev");
        buttonFoll = document.getElementById("foll");
        buttonPrev.innerHTML = 'PLAYING'
        buttonFoll.innerHTML = 'PAUSE'

        rLine = document.getElementById("insert-songs")
        rLine.style.top =  '-25vh';
        rLine.style.right = '15vw';
        rLine.style.width = '40vw';
        
        if (songIsPlaying === true) {
            console.log('here')
            audio.parentNode.removeChild(audio)
            context.close();
            for (let num = 0; num < int(windowHeight/70); num++) {
                try {
                    audioStringArtist = document.getElementById("artist-bottom")
                    audioStringArtist.parentNode.removeChild(audioStringArtist)
                    audioStringName = document.getElementById("melody-bottom")
                    audioStringName.parentNode.removeChild(audioStringName)
                } catch (e){
                }
            }
        }

        audioElement = document.createElement("audio");
        audioElement.id = 'song';
        audioElement.controls = 'controls';
        document.getElementById('audio').appendChild(audioElement)
        audio = document.getElementById("song");
        songIsPlaying = true;
        files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        
        lastSample = false;

        context = new AudioContext();

        src = context.createMediaElementSource(audio);

        analyser = context.createAnalyser();

        src.connect(analyser);
        analyser.connect(context.destination);

        try {
            analyser.fftSize = 8192;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        } catch (e){
            analyser.fftSize = 4096;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
        
        getInfo();
        deleteInfo();
        createInfo();
        analyser.getByteFrequencyData(dataArray);
    }
}

function setup() {
    createCanvas(windowWidth * 0.59, windowWidth * 0.59, WEBGL);
    maxD = (0, 0, width/2, width/2)
    canvas.style.bottom = '15vh'
    canvas.style.left = '42vw'
    canvas.style.position = 'fixed'
}

function draw() {
    if (songIsPlaying === true || lastSample === true) {
        if (lastSample === true) {
            sample_analyser.getByteFrequencyData(dataArray);
        } else {
            analyser.getByteFrequencyData(dataArray);
        }
        dataArray.reverse()
        clear()
        ortho(-1900, 900, -1000, 1900, -400, 2100);
        rotateX(-PI/5);
        rotateY(-2*PI/3);
        for (let z = 0; z < 900; z += w){
            for (let x = 0; x < 1800; x += w) {
                let d = dist(x, z, 800, 800);
                let offset = map(d, 0, maxD, 1, 10);
                push();
                h = 3 * dataArray[400+(10 * z + x)/10];
                barH = map(1/offset, 0, 0.2, 0, h);
                barColor = map(h/4,0,230,23,255)
                translate(x - 450, -barH/2,  z - 450);
                if (barH === 0) {
                    fill(255,255,255,0)
                } else {
                    fill(barColor);
                    box(w, barH, w);
                }
                pop();
                push(); 
                translate(x - 450, -barH/2,  -(z - 900) + 4.7*w);
                if (barH === 0) {
                    fill(255,255,255,0)
                } else {
                    fill(barColor);
                    box(w, barH, w);
                }
                pop();
            }
        }
    } else {

    }   
}

function buttonPressed() {
    if (buttonWasPressed === false) {
        buttonPrev.innerHTML = 'PAUSED';
        buttonFoll.innerHTML = 'PLAY';
        audio.pause();
        buttonWasPressed = true;
        dataArrayOld = dataArray;
    } else {
        buttonPrev.innerHTML = 'PLAYING';
        buttonFoll.innerHTML = 'PAUSE';

        if (lastSample === true) {
            getInfo();
            deleteInfo();
            createInfo();
            lastSample = false;
            dataArray = dataArrayOld;
        }
       
        audio.play();
        
        buttonWasPressed = false
    }
}

function createInfo() {
    for (let num = 0; num < int(windowHeight/70); num++) {
        audioStringArtist = document.createElement("marquee");
        audioStringName = document.createElement("marquee");
        audioStringArtist.id = 'artist-bottom';
        audioStringArtist.truespeed = 'truespeed';
        audioStringName.truespeed = 'truespeed';
        audioStringName.id = 'melody-bottom';
        audioStringArtist.scrollAmount=num/2 + 6
        audioStringName.scrollAmount=num/2 + 5
        audioStringArtist.direction = 'left';
        audioStringArtist.innerHTML = artist.toUpperCase();
        audioStringName.direction = 'right';
        audioStringArtist.scrollDelay = 300*(Math.random());
        audioStringName.scrollDelay = 300*(Math.random());
        audioStringName.innerHTML = songName.toUpperCase();
        document.getElementById('insert-songs').appendChild(audioStringArtist)
        document.getElementById('insert-songs').appendChild(audioStringName)
    }
    numberOfLines = int(windowHeight/70);
}

function deleteInfo() {
    try {
        for (let num = 0; num < numberOfLines; num++) {
            audioStringArtist = document.getElementById("artist-bottom")
            audioStringArtist.parentNode.removeChild(audioStringArtist)
            audioStringName = document.getElementById("melody-bottom")
            audioStringName.parentNode.removeChild(audioStringName)
        }
    } catch (e) {

    }
}

function getInfo() {
    myre = /(.+)\-.(.+)\./g;
    fileName = files[0].name;
    fileName = fileName.replaceAll('_', ' ');
    fileName = fileName.replaceAll(/[0-9]/g, '');

    try {
        let fullName = myre.exec(fileName);
        artist = fullName[1];
        songName = fullName[2];
    } catch {
        myre = /(.+)\./g
        let fullName = myre.exec(fileName);
        artist = fullName[1];
    }
}
function sampleOnePressed() {
    if (songIsPlaying === false || buttonWasPressed === true) {
        
        audioElement = document.createElement("audio");
        audioElement.id = 'song';
        audioElement.controls = 'controls';
        audioElement.src = './Samples/sample-one.mp3';
        audioElement.play();

        lastSample = true;

        artist = 'SAMPLE'
        songName = 'ONE'

        deleteInfo();
        createInfo();

        sample_context = new AudioContext();

        sample_src = sample_context.createMediaElementSource(audioElement);

        sample_analyser = sample_context.createAnalyser();

        sample_src.connect(sample_analyser);
        sample_analyser.connect(sample_context.destination);

        sample_analyser.fftSize = 4096;
        sampleBufferLength = sample_analyser.frequencyBinCount;
        dataArray = new Uint8Array(sampleBufferLength);

        sample_analyser.getByteFrequencyData(dataArray);

    } else {

    }
}

function sampleTwoPressed() {
    if (songIsPlaying === false || buttonWasPressed === true) {

        audioElement = document.createElement("audio");
        audioElement.id = 'song';
        audioElement.controls = 'controls';
        audioElement.src = './Samples/sample-two.mp3';
        audioElement.play();

        lastSample = true;

        artist = 'SAMPLE';
        songName = 'TWO';

        deleteInfo();
        createInfo();
        
        sample_context = new AudioContext();

        sample_src = sample_context.createMediaElementSource(audioElement);

        sample_analyser = sample_context.createAnalyser();

        sample_src.connect(sample_analyser);
        sample_analyser.connect(sample_context.destination);

        sample_analyser.fftSize = 4096;
        sampleBufferLength = sample_analyser.frequencyBinCount;
        dataArray = new Uint8Array(sampleBufferLength);

        sample_analyser.getByteFrequencyData(dataArray);

    } else {

    }
}
