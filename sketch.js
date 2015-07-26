var canvas;
var fish;
var fishList = [];
var drawButton;
var eraseAllButton;
var randomSlider;
var eraser = false;
var onCanvas;
var randomness = 100;
var switchModeButton;
var approachButton;
var switchDirectionButton;
var facingForward = true;
var approach = false;
var modeCurrent = 0;
var firstTimeSwitch = true;
var fishSegmentSize = 5;
var fishSizeOff = 0;
var fishGrowthFactor= 1;
var fishStopGrowing = false;
var fishRed = 0;
var fishGreen = 225;
var fishBlue = 255;
var fishSize = 100;
var fishGrow = true;  
var onTail;
var approachSpeed;
var xTiming;





function setup() {
  xTiming = random(0.003, 0.01);

  canvas = createCanvas(1000, 600);
  canvas.parent('canvasContainer');
  canvas.mouseOver(function() { onCanvas = true; });
  canvas.mouseOut( function() { onCanvas = false; });
  fish = new Fish();
  randomSlider = createSlider(0, 100, 1);
  randomSlider.parent('controls');
  randomSlider.html("test");
  switchModeButton = createButton("Switch Mode");
  switchModeButton.parent('controls');
  switchModeButton.mousePressed(function() { modeCurrent++; });
  approachButton = createButton("Release");
  approachButton.parent('controls');
  approachButton.mousePressed(function() { approach = true; })

  switchDirectionButton = createButton("Turn Around");
  switchDirectionButton.parent('controls');
  switchDirectionButton.mousePressed(function() { 
    facingForward = !facingForward; 
    reverse(fishList);
  })


  drawButton = createButton("Eraser");
  drawButton.parent('controls');
  drawButton.mousePressed(
    function() { 
    if (eraser === false) {
      drawButton.html('Bubbler');
      cursor(HAND);
    } else {
      drawButton.html('Eraser');
    }

    eraser = !eraser;
  });
  eraseAllButton = createButton("Reset");
  eraseAllButton.parent('controls');
  eraseAllButton.mousePressed(eraseEverything)
}

function draw() {
  changeMode();
  randomness = randomSlider.value()/10000;
  if (eraser === false && mouseIsPressed && onCanvas === true && fishStopGrowing === false) {
    fishList.unshift(new Fish());
  } 
  if (keyIsPressed) {
    ;
  }

  for (i = 0; i < fishList.length; i++) {
    fish = fishList[i];
    fish.move();
    fish.display();
    if  (eraser === true && mouseIsPressed && dist(fish.x, fish.y, mouseX, mouseY) < 10){
      fishList.splice(i, 1);
    }
  }
}

function mouseReleased() {
  fishStopGrowing = false;
  fishBlue = random(255);
  fishGreen = random(255);
  fishRed = random(255);
  xTiming = random(0.003, 0.01);
}

function changeMode() {
  if (modeCurrent > 2) {
    modeCurrent = 0;
    firstTimeSwitch = true;
  } else if (modeCurrent === 0) {
    background(15, 55, 77);
  } else if (modeCurrent === 1) {
    fill(255, 10); // semi-transparent white
    rect(-1, -1, width+2, height+2);
  } else if (modeCurrent === 2) {
    if (firstTimeSwitch === true) {
      background(0,0,0);
      firstTimeSwitch = false;
    }
    noStroke();
    fill(0, 1); 
    rect(0, 0, width, height);

    fill(255,255,0, 100); 
  }
};

function eraseEverything() {
  modeCurrent = 0;
  fishList = [];
}

// fish class
function Fish() {
  this.x = mouseX;
  this.y = mouseY;
  this.diameter = fishSegmentSize;
  var attracted = false;
  var moveXOff = 0;
  var moveYOff = 500;
  var yTiming = 0.005;

  fishRed = fishRed + 10
  fishBlue = fishBlue -10
  this.blue = fishBlue;
  this.red = fishRed;
  this.green = fishGreen;
  fishSegmentSize = fishSegmentSize + fishGrowthFactor;
  fishSizeOff = fishSizeOff + 0.01;
  if (fishGrowthFactor > 8) {
    fishGrow = false;
  } else if (fishGrowthFactor < -8) {
    fishGrow = true;
    onTail = true;
  }
  if (fishGrow === true) {
    fishGrowthFactor = fishGrowthFactor + 2;
  } else if (fishGrow === false) {
    fishGrowthFactor = fishGrowthFactor - 2;
  }
  if (fishGrowthFactor > 8 && onTail === true) {
    fishStopGrowing = true;
    fishSegmentSize = 10;
    // moveXOff = moveXOff + 100000;

  }




  this.move = function() {
    moveXOff = moveXOff + xTiming+ randomness;
    moveYOff = moveYOff + yTiming;

    var xMoveRandomness = noise(moveXOff)*(width);
    var yMoveRandomness = noise(moveYOff)*(height);

    this.x = xMoveRandomness;
    this.y = yMoveRandomness;


  };

  this.display = function() {
    fill(this.red, this.green, this.blue);
    stroke(0, 0, 0, 200);
    rectMode(CENTER);
    // rect(this.x, this.y, this.diameter/1.5, this.diameter, this.diameter);

    ellipse(this.x, this.y, this.diameter/(2-(xTiming*1-0)), this.diameter/(2-(yTiming*100)));

    if (approach === true) {
      if (facingForward === true){
        approachSpeed = 0.001;
        xTiming = xTiming + 0.0000002
        yTiming = yTiming + 0.000001
      } else {
        approachSpeed = -0.002;
        xTiming = xTiming - 0.0000001;
        // yTiming = yTiming - 0.000001;
      }
      this.diameter = this.diameter + (this.diameter * approachSpeed)
      // approachSpeed = approachSpeed + (0.0000001)
    }


  }
};