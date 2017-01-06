//////////////////
//Global Variables
var gameOn= false;
var gameStarted= false;
var strictLight=false;
var userInput=false;
var count=1;
var userCount=1;
var gameSequence=[];
var buttonColorOn=['red','blue','yellow','green'];
var buttonColorOff=['#800000','#00004d','#666600','#003300'];
var gameInterval=1500;
var timeouts = [];//store all timeouts


////////////////////////////////
//When User clicks on off button
$(".onOffButton").click(function(){
  clearAllTimeOuts();
  
  if(!gameOn){
    //swap boxes
    $("#onOffRight").css("background","#1E90FF");
    $("#onOffLeft").css("background","black");
    
    //turn on counter light
    $(".countRead").css("color","#e60000");

  }
  
  else{
    //swap boxes
    $("#onOffLeft").css("background","#1E90FF");
    $("#onOffRight").css("background","black");
    
      //turn off counter light
    $(".countRead").css("color","#660000");
    
    //clear strict light
    strictLight=false;
    $(".strictLight").css("background","black");
    
    //clear count
    $(".countRead").html("- -");
  }
   gameOn=!gameOn
});
 
////////////////////////////////
//When user clicks strict button
$("#strict").click(function(){

  //if game on
if(gameOn){
  
  
  //if light off
   if(!strictLight) {
    $(".strictLight").css("background","red");
    }
  
  //if light on
  else{
    $(".strictLight").css("background","black");
  }
  
  //swap light
  strictLight=!strictLight
}

});

$("#start").click(function(){
 
  clearAllTimeOuts();
  //if game is on
  if(gameOn){
    
    //generate a game
    gameSequence=generateRound();
   
    
    //reset count
   count=1;
    
    //flash count read
     $(".countRead").css("color","#660000");

 timeouts.push(setTimeout(function () {
   $(".countRead").css("color","#e60000");
 }, 250));
   
 timeouts.push(setTimeout(function () {
   $(".countRead").css("color","#660000");
   }, 500));
  
  timeouts.push(setTimeout(function () {
   $(".countRead").css("color","#e60000");
   
   }, 750));
  
 timeouts.push(setTimeout(function () {
    playGame();
   }, 1000));
  
  
  } 
});

//////////////////////////
//Generate sequence of 20 random numbers
function generateRound(){
  var round=[];
  for (i=0;i<=19;i++){
    round[i]=Math.floor((Math.random() * 4) + 1);
  }
  return round;
}


///////////////////////////////
///light up selected button. 1=red, 2=blue, 3=yellow, 4=green
function lightButtonOn(gameButton){

  
  if(gameButton===1){
   $("#redButton").css("background",buttonColorOn[gameButton-1]);
   $(".redSound").trigger('play');
  }
  
  else if(gameButton===2){
    $("#blueButton").css("background",buttonColorOn[gameButton-1]);
    $(".blueSound").trigger('play');
  }
  
  else if(gameButton===3){
    $("#yellowButton").css("background",buttonColorOn[gameButton-1]);
    $(".yellowSound").trigger('play');
  }
  
  else if(gameButton===4){
    $("#greenButton").css("background",buttonColorOn[gameButton-1]);
     $(".greenSound").trigger('play');
  }

} 


/////////////////////////////
//Turn off specified light
function lightButtonOff(gameButton){
    if(gameButton===1){
    $("#redButton").css("background",buttonColorOff[gameButton-1]);
      $(".redSound").trigger('pause');
  }
  
  else if(gameButton===2){
    $("#blueButton").css("background",buttonColorOff[gameButton-1]);
    $(".blueSound").trigger('pause');
  }
  
  else if(gameButton===3){
    $("#yellowButton").css("background",buttonColorOff[gameButton-1]);
   $(".yellowSound").trigger('pause');
  }
  
  else if(gameButton===4){
    $("#greenButton").css("background",buttonColorOff[gameButton-1]);
      $(".greenSound").trigger('pause');
  }
} 
  

///////////////////
//Clear Timeout queue
function clearAllTimeOuts(){

for (var i=0; i<timeouts.length; i++) {
  clearTimeout(timeouts[i]);
}
  //make sure all lights are off
  lightButtonOff(1);
  lightButtonOff(2);
  lightButtonOff(3);
  lightButtonOff(4);
}






///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//Actual game playing
function playGame(){
  $(".countRead").html(count)
  playGameSequence();
  
  
 }


///////////////////////////////
//Playback game sequence

function playGameSequence(){
  
    //play game sequence
for(i=1;i<=count;i++)
    {
 
      //Turn Light On
      (function(i){ 
        
   timeouts.push(setTimeout(function () {
   lightButtonOn(gameSequence[i-1]);
 }, gameInterval*i));
      
      
      })(i);
      
   //Turn Light Off
      (function(i){ 
        
   timeouts.push(setTimeout(function () {
   lightButtonOff(gameSequence[i-1]);
 }, gameInterval*i+gameInterval));
      
      })(i);
      
    }
  
  //allow user input, turn on user flag
 timeouts.push(setTimeout(function () {
   userInput=true;
   //alert("on");
 }, (gameInterval*count)+(gameInterval)));
  
 //disallow user input, turn off user flag
 timeouts.push(setTimeout(function () {
   userInput=false;
    $(".countRead").html("!!");
 }, (gameInterval*count*2)+(gameInterval)));
  

//restart game after user is out of time  
timeouts.push(setTimeout(function () {
  //reset count if strict   
  if(strictLight){
       count=1;
     }
     
     
   playGame();
   //alert("off");
 }, 500+(gameInterval*count*2)+(gameInterval)));
  
}


///////////////////////////////////
//If User presses button
$(".playButton").click(function(){
  var buttonId=0;
  
  if(userInput){

    
    if ($(this).attr("id") === "redButton") {
      buttonId=1;
    }
    
    else if ($(this).attr("id") === "blueButton") {
      buttonId=2;
    }
    
    else if ($(this).attr("id") === "yellowButton") {
      buttonId=3;
    }
     
    
   else if ($(this).attr("id") === "greenButton") {
      buttonId=4;
    }
   


    //if it is the right button
    if(gameSequence[userCount-1]===buttonId)
      {
     
    lightButtonOn(buttonId);
        userInput=false;

    timeouts.push(setTimeout(function () {
    lightButtonOff(buttonId);
    
      userCount++;
      userInput=true;
      
   if(userCount>count){
       
     if (count<20){
      count++;
      userCount=1;
      clearAllTimeOuts();
      playGame();
     }
     
     //if user wins
     else{
       alert("You Win!!!!!!");
       count=1;
        playGame();
     }
      
    }
     
    }, 250));
      
  }

     
    ///if it is the wrong button
    else{
       
       $(".countRead").html("!!");
       
  //reset count if strict   
  if(strictLight){
       count=1;
     }
     
       
        lightButtonOn(buttonId);
        userInput=false;

    timeouts.push(setTimeout(function () {
    lightButtonOff(buttonId);
         }, 250));
       
       
      timeouts.push(setTimeout(function () {
        // $(".countRead").html("0"+count);
       clearAllTimeOuts();
       userCount=1;
       playGame();
          }, 500));
       
       
     }
    

  }
  
});