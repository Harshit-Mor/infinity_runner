var PLAY = 1;
var END = 0;
var gameState = PLAY;

var flyingCar, flyingCar_flying, flyingCar_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var carsGroup, car1, car2, car3, car4, car5;

var score;
var gameOverImg,restartImg

function preload(){
  flyingCar_flying = loadAnimation("flying car1.png","flying car3.png","flying car4.png");
  flyingCar_collided = loadAnimation("flying car_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  car1 = loadImage("car1.png");
  car2 = loadImage("car2.png");
  car3 = loadImage("car3.png");
  car4 = loadImage("car4.png");
  car5 = loadImage("car5.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  flyingCar = createSprite(50,160,20,50);
  flyingCar.addAnimation("flying", flyingCar_flying);
  flyingCar.addAnimation("collided", flyingCar_collided);
  

  flyingCar.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create car and Cloud Groups
  carsGroup = createGroup();
  cloudsGroup = createGroup();

  
  flyingCar.setCollider("rectangle",0,0,flyingCar.width,flyingCar.height);
  flyingCar.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& flyingCar.y >= 100) {
        flyingCar.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    flyingCar.velocityY = flyingCar.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn cars on the ground
    spawncars();
    
    if(carsGroup.isTouching(flyingCar)){
        //flying car.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the flying car animation
      flyingCar.changeAnimation("collided", flyingCar_collided);
    
     
     
      ground.velocityX = 0;
      flyingCar.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    carsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     carsGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop flying car from falling down
  flyingCar.collide(invisibleGround);
  
  if(mousePressedOver(restart) && gameState===END) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY;
  carsGroup.destroyEach();
  cloudsGroup.destroyEach();
  flyingCar.changeAnimation("flying",flyingCar_flying)
  score=0;
}


function spawncars(){
 if (frameCount % 60 === 0){
   var car = createSprite(600,165,10,40);
   car.velocityX = -(6 + score/100);
   
    //generate random cars
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: car.addImage(car1);
              break;
      case 2: car.addImage(car2);
              break;
      case 3: car.addImage(car3);
              break;
      case 4: car.addImage(car4);
              break;
      case 5: car.addImage(car5);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the car           
    car.scale = 0.5;
    car.lifetime = 300;
   
   //add each car to the group
    carsGroup.add(car);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = flyingCar.depth;
    flyingCar.depth = flyingCar.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

