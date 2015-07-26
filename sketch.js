var canvas;
var worm;
var wormList = [];
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
var wormSegmentSize = 10;
var wormSizeOff = 0;
var wormGrowthFactor= 1;
var wormStopGrowing = false;
var wormRed = 0;
var wormGreen = 50;
var wormBlue = 255;
var wormSize = 100;
var wormGrow = true;  
var onTail;
var approachSpeed;





function setup() {
  canvas = createCanvas(1000, 600);
  canvas.parent('canvasContainer');
  canvas.mouseOver(function() { onCanvas = true; });
  canvas.mouseOut( function() { onCanvas = false; });
  worm = new Worm();
  // randomSlider = createSlider(1, 100, 10);
  // randomSlider.parent('controls');
  // randomSlider.html("test");
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
    reverse(wormList);
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
  // randomness = randomSlider.value();
  if (eraser === false && mouseIsPressed && onCanvas === true && wormStopGrowing === false) {
    wormList.unshift(new Worm());
  } 
  if (keyIsPressed) {
    ;
  }

  for (i = 0; i < wormList.length; i++) {
    worm = wormList[i];
    worm.move();
    worm.display();
    if  (eraser === true && mouseIsPressed && dist(worm.x, worm.y, mouseX, mouseY) < 10){
      wormList.splice(i, 1);
    }
  }
}

function mouseReleased() {
  wormStopGrowing = false;
  wormBlue = random(255);
  wormGreen = random(255);
  wormRed = random(255);
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
    fill(0, 5); 
    rect(0, 0, width, height);

    fill(255,255,0, 100); 
  }
};

function eraseEverything() {
  modeCurrent = 0;
  wormList = [];
}

// Worm class
function Worm() {
  this.x = mouseX;
  this.y = mouseY;
  this.diameter = wormSegmentSize;
  var attracted = false;
  var moveXOff = 0;
  var moveYOff = 500;
  var xTime = 0.01;
  var yTime = 0.005;

  wormRed = wormRed + 10
  wormBlue = wormBlue -10
  this.blue = wormBlue;
  this.red = wormRed;
  this.green = wormGreen;
  wormSegmentSize = wormSegmentSize + wormGrowthFactor;
  wormSizeOff = wormSizeOff + 0.01;
  if (wormGrowthFactor > 8) {
    wormGrow = false;
  } else if (wormGrowthFactor < -8) {
    wormGrow = true;
    onTail = true;
  }
  if (wormGrow === true) {
    wormGrowthFactor = wormGrowthFactor + 2;
  } else if (wormGrow === false) {
    wormGrowthFactor = wormGrowthFactor - 2;
  }
  if (wormGrowthFactor > 8 && onTail === true) {
    wormStopGrowing = true;
    wormSegmentSize = 10;
    // moveXOff = moveXOff + 100000;

  }




  this.move = function() {
    moveXOff = moveXOff + xTime;
    moveYOff = moveYOff + yTime;

    var xMoveRandomness = noise(moveXOff)*(width);
    var yMoveRandomness = noise(moveYOff)*(height);

    this.x = xMoveRandomness;
    this.y = yMoveRandomness;

    // this.x = ((this.x*randomness) + xMoveRandomness)/(1+randomness);
    // this.y = ((this.y*randomness) + yMoveRandomness)/(1+randomness);


  };

  this.display = function() {
    fill(this.red, this.green, this.blue);
    stroke(0, 0, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    if (approach === true) {
      if (facingForward === true){
        approachSpeed = 0.001;
        xTime = xTime + 0.0000002
        yTime = yTime + 0.000001
      } else {
        approachSpeed = -0.002;
        xTime = xTime - 0.0000001;
        // yTime = yTime - 0.000001;
      }
      this.diameter = this.diameter + (this.diameter * approachSpeed)
      // approachSpeed = approachSpeed + (0.0000001)
    }


  }
};