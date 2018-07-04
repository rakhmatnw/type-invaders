// SECTION DOM
const startMenu = document.getElementById('start-menu');
const main = document.getElementById('main');
const finishMenu = document.getElementById('finish');

// START UI DOM
const startBtn = document.getElementById('start');
const music = document.getElementById('music');
let mode = document.getElementById('mode');

// MAIN GAME ELEMENT & UI
const type = document.getElementById('main-1');
const input = document.getElementById('inputTxt');
const pointsTxt = document.getElementById('points');
const missedTxt = document.getElementById('missed');

// AUDIO DOM
const theme = document.getElementById('theme');
const audioPoint = document.getElementById('audioPoint');
const audioMissed = document.getElementById('audioMissed');
const audioError = document.getElementById('audioError');

let txtArray = [];
let speed;
let velocity;
let wave;
let invator;
let time;
let p; //point variable
let m; //missed variable

let played;


// PLAY & PAUSE MUSIC
music.addEventListener('click', function(){
    
    theme.volume = 0.3;
    audioPoint.volume = 0.7;

    if(played){
        theme.pause();
        music.innerText = "MUSIC: OFF";
        music.style.backgroundColor = "var(--red)"
    }else{
        theme.play();
        music.innerText = "MUSIC: ON";    
        music.style.backgroundColor = "var(--green)"      
    }

    theme.addEventListener('play', function(){
        played = true;
        
    });

    theme.addEventListener('pause', function(){
        played = false;
    });

});
    

// CHOOSING GAME MODE
mode.addEventListener('change', function(){
    if(mode.value == 1){
        speed = 200;
        velocity = 20;
        wave = 1000 * 100;

        invator = 10;
        time = 1000 * 60;

    }else if(mode.value == 2){
        speed = 300;
        velocity = 20;
        wave = 1000 * 100;

        invator = 8;
        time = 1000 * 60;
    }
});


// RESTART GAME IF PLAYER WANT TO PLAY AGAIN
function resart(){
    txtArray=[];
    time = 1000 * 60;
    
    p = 0;
    m = 0;
    pointsTxt.innerText = p;
    missedTxt.innerText = m;
    
    type.innerHTML = '';
}

// FETCH TEXT DATA
function fetchIt(){

    fetch('https://baconipsum.com/api/?type=all-meat&sentences='+invator+'&format=text')
    .then(function(res){
        return res.text()
    })
    .then(function(text){
        txtArray = text.split(" ")      

        txtArray.forEach(function(e, i){
            let d = Math.floor(Math.random()*(150 - 50) + 50); 

            let txt = document.createElement('h1');
            let ranTop = Math.floor(Math.random() * 90);
            let ranLeft = -(i*d);
            // console.log(txtArray.length);
            txt.style.top = ranTop + '%';
            txt.style.left = ranLeft + 'px' ;
    
            txt.className = "type";
            txt.innerText = e;
            type.appendChild(txt);
        });

    });
};


// GAMEPLAY STARTED
function playIt(){
    
    p = 0;
    m = 0;

    // TIMER
    if(mode.value == 1){
        console.log('MODE STANDARD');

        let timerDOM = document.getElementById('timer');

        let timer = setInterval(function(){
            time -= 1000;
            timerDOM.innerText = 'TIME = 00:' + time/1000;

            if(time <= 0){
                clearInterval(typeMove);
                clearInterval(newWave);
                clearInterval(timer);

                input.disabled = true;
                
                gameOver();
                console.log('GAME OVER');
            }
            
        }, 1000);
    };

    // MOVING TYPE INVADERS
    let typeMove = setInterval(function(){
        let txt = document.querySelectorAll('h1');
        
        txt.forEach(function(e){
            left = parseInt(e.style.left.replace('px',''));
            left += velocity; 
            e.style.left = left + 'px';

            // CHANGING TYPE COLOR IN CERTAIN POSITION
            if(left > type.clientWidth*40/100 && left < type.clientWidth*75/100){
                e.style.color = 'var(--yellow)';    
            }
            
            // CHANGING TYPE COLOR IN CERTAIN POSITION            
            if(left > type.clientWidth*75/100){
                e.style.color = 'var(--red)';
            }

            // IF TYPE IS OUT OF FRAME
            if(left >= type.clientWidth) {
                e.remove();
                txtArray.shift();
                audioMissed.currentTime = 0;
                audioMissed.play();
                m += 1;
                missedTxt.innerText = m;

                if(mode.value == 2) {
                console.log('MODE SURVIVAL');
                    if(m >= 10){
                        clearInterval(typeMove);
                        clearInterval(newWave);
                        clearInterval(timer);

                        input.disabled = true;
                        
                        console.log('GAME OVER');
                        gameOver();
                    }
                }
            }

        })  
    }, speed);

    // NEW WAVE
    let newWave = setInterval(function(){
        fetchIt();
        console.log('NEW WAVE!');
    }, wave);

        
    // IF ENTER KEY PRESSED
    input.addEventListener('keyup', function(e){
        e.preventDefault;

        if(e.keyCode == '13'){
            let type = document.querySelectorAll('.type');

            type.forEach(function(r){
                if(input.value == r.innerText){
                    audioPoint.currentTime = 0;
                    audioPoint.play();
                    txtArray.shift();

                    r.classList.add('type-point');
                    setTimeout(function(){
                        r.remove();
                    }, 500)

                    p += 1;
                    pointsTxt.innerText = p;
                    input.value = '';
                };       
            });       
        };
    });
};

// GAME OVER 
function gameOver(){

    finishMenu.style.display = 'block'; 

    let modeTitle = document.getElementById('mode-title');
    let finalScore = document.getElementById('final-score');
    let scoreDetail =document.getElementById('score-detail');
    let comment = document.getElementById('comment');

    let playAgain = document.getElementById('again');
    let exit = document.getElementById('exit');

    exit.addEventListener('click', function(){
        finishMenu.style.display = 'none'; 
        main.style.display = 'none';
        startMenu.style.display = 'block';      
        resart();  
    });

    playAgain.addEventListener('click', function(){
        finishMenu.style.display = 'none'; 
        resart();
        fetchIt();
        playIt();
    });


    if(mode.value == 1){
        modeTitle.innerText = 'STANDARD';
    }else if(mode.value == 2){
        modeTitle.innerText = 'SURVIVAL';    
    }

    let fs = Math.floor((p/(p+m)) * 100);
    scoreDetail.innerText = `Points : ${p} | Missed : ${m}`;
    finalScore.innerText = fs;
    if(fs <= 30){
        comment.innerText = "You sucks! :p";
        
    }else if(fs >= 30 && fs <= 50){
        comment.innerText = "really? that's all you got?";
        
    }else if(fs >= 50 && fs <= 70){
        comment.innerText = "Not bad..";
    }else{
        comment.innerText = "Well done! You're great!";

    }
};


// START THE GAME
startBtn.addEventListener('click', function(){
    
    if(mode.value == ''){
        alert('choose mode!')
    }else{
        startMenu.style.display = 'none';
        main.style.display = 'grid';
        fetchIt();
        playIt();
    }

});




