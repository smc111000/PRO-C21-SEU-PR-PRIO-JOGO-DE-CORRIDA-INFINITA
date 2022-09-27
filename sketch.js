var PLAY = 1;
var END = 0;
var gameState = PLAY;

var controle;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg

var score=0;

var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg1.jpg")
  sunAnimation = loadImage("sun.png2.png");
  
  controle_img = loadImage("dualsense-controller-product-thumbnail-01-en-14sep21.webp");
   
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-90,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.20;
  
  controle = createSprite(50,height-70,20,50);
  controle.addImage(controle_img);
  controle.setCollider('circle',0,0,350);
  controle.scale = 0.1;
  //controle.debug=true;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "gray";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);


  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //controle.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("white")
  text("Pontuação: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);//
    ground.velocityX = -(6 + 3*score/100);//
    
    if((touches.length > 0 || keyDown("SPACE")) && controle.y  >= height-120) {
      jumpSound.play( )
      controle.velocityY = -15;
       touches = [];
    }
    
    controle.velocityY = controle.velocityY + 0.8;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    controle.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(controle)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;
    
    //defina a velocidade de cada objeto do jogo para 0
    ground.velocityX = 0;
    controle.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 600;
    
    //ajustar a profundidade
    cloud.depth = controle.depth;
    controle.depth = controle.depth+1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1200,height-100,20,30);
    obstacle.setCollider('circle',0,0,100);
    //obstacle.debug = true;
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = controle.depth;
    controle.depth +=1;
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
  
}

