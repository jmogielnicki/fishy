var canvas;
var fishList = [];
var trails = false;
var backgroundTransparency = 1;
var lightBeamOne;
var spotLightOn = false;
var darknessSlider;
var darkness = 10;
var forward = true;
var fishColorChangeAmount = 0;
var fishNameArray = ['Riley', 'Kale', 'Eli', 'Davis']
var fishNameCount = 0;
var showName = true;
var dayLight = false;
var yWaveTime = 0.0;
var psychedelicOn = false;
var sizeChange = 1;


function preload() {
  soundFormats('ogg', 'mp3');
  waterDropSound = loadSound('assets/sounds/waterDrop.mp3');
}

function setup() {
  waterDropSound.play();
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer');
  canvas.mouseOver(function() { onCanvas = true; });
  canvas.mouseOut( function() { onCanvas = false; });
  colorMode(HSL, 360, 100, 100);
  createButtons();

  // darknessSlider = createSlider(1, 20, 5);
  // darknessSlider.parent('controls');
  // darknessSlider.html('Darkness');
}


function draw() {

  if (dayLight === true) {
    darkness = 50;
  } else {
    darkness = 20;
  }
  if(trails === false) {
    backgroundTransparency = 1;
  } else {
    backgroundTransparency = 0.01;
  }
  fill(101, 80, 100, backgroundTransparency);
  rect(-1, -1, width+1, height+1)

  createWave();

//Display fish
  stroke(100, 100, 0);
  for (i = 0; i < fishList.length; i++) {
    fish = fishList[i];
    fish.display();
    fish.move();
  }
}

function makeButtons (text, method) {
  button = createButton(text);
  button.class('btn btn-default')
  button.parent('controls');
  button.mousePressed(method);
}


function createButtons() {

  nameBoxLabel = createElement('h4', 'Enter Fish Name');
  nameBoxLabel.parent('controls');
  nameBox = createInput('');
  // nameBox.class('form-control fish-name');
  nameBox.html('Fish Name')
  nameBox.parent('controls');
  
  makeButtons('Create Fish', createFish);
  makeButtons('Show/Hide Names', showNames);
  makeButtons('Spotlight', spotLightOnOff);
  makeButtons('Day/Night', dayLightOn);
  makeButtons('Psychedelic', psychedelic);
}


function psychedelic() {
  psychedelicOn = !psychedelicOn;
  if (psychedelicOn === true) {
    dayLight = true;
    if (fishColorChangeAmount === 0) {
      fishColorChangeAmount = 4;
    } else {
      fishColorChangeAmount = 0;
    } 
  } else {
    daylight = false;
    fishColorChangeAmount = 0;
  }
};

function createWave(){
// Experimenting with wave 
  fill(201, 80, darkness/2, backgroundTransparency);
  beginShape(); 
  var xWaveTime = 0;
  // Iterate over horizontal pixels
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to width
    var y = map(noise(xWaveTime, yWaveTime), 0, 1, 0,50);
    // Set the vertex
    vertex(x, y); 
    // Increment x dimension for noise
    xWaveTime += 0.05;
  }
  // increment y dimension for noise
  yWaveTime += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  if(spotLightOn === true) {
    lightBeam();
  }
}

function createSliders(name, label, parent, min, max, start) {
  name = createSlider(min, max, start);
  name.parent(parent);
  name.html(label);
  frameRate(name.value());
}

function lightBeam() {
  noStroke();
  fill(0, 100, 100, .03);
  ellipse(mouseX, mouseY, 300, 300);
  // beginShape();
  // vertex(mouseX, 0);
  // vertex(mouseX, 0);
  // vertex((mouseX)-(height/4), height);
  // vertex((mouseX)+(height/8), height);
  // endShape();
}

function createFish() {

  fishName = nameBox.value();
  nameBox.value('');
  fishList.unshift(new Fish(random(10, 75), random(1, 6), random(20, 25), fishName));
  waterDropSound.play();
  fishNameCount += 1;
}

function showNames() {
  showName = !showName;
}

function spotLightOnOff() {
  spotLightOn = !spotLightOn
}

function dayLightOn() {
  dayLight = !dayLight;
}

function keyPressed() {
  if(keyCode === 84) {
    trails = !trails;
  }

  if(keyCode === 70) {
    forward = !forward;
    for(var i = 0; i < fishList.length; i++) {
      fishList[i].segmentList.reverse();
    }
  }


  if(keyCode === 67) {

  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(201, 80.5, 15);
}

// fish class
function Fish(maxSize, heightToWidthRatio, numSegments, fishName) {
  colorMode(HSL, 360, 100, 100);
  this.numSegments = numSegments;
  this.perlinXStartTime = random(0,10000);
  this.perlinYStartTime = random(0,10000);
  this.segmentList = [];
  this.maxSize = maxSize;
  this.heightToWidthRatio = heightToWidthRatio; 
  this.a = 0.0;
  this.inc = TWO_PI/(this.numSegments + (this.numSegments/1.6));
  this.initialHue = random(360);
  this.hueInc = random(-10, 10);
  this.saturation = random(30, 100);
  this.fishName = fishName;

  //Adding this to be a anchor for size and ligthness to show 3d depth
  this.distance = 0;


  // Future: evolve this to class method
  for(i = 0; i < this.numSegments; i++) {
    // Use this 
    var percentToComplete = map(i, 0, this.numSegments, 0, 1);
    var perlinXValue = noise(this.perlinXStartTime);
    var perlinYValue = noise(this.perlinYStartTime);
    var segmentXPosition = map(perlinXValue, 0, 1, 0, width);
    var segmentYPosition = map(perlinYValue, 0, 1, 0, height);
    
    // Create curve of fish using sin curve
    segmentSize = abs(sin(this.a) * this.maxSize);

    // set color 

    segmentColor = color((this.initialHue) , 100, 50);
    this.initialHue += this.hueInc;
    this.segmentList.unshift(new Segment(i, this.initialHue, segmentXPosition, segmentYPosition, segmentSize, this.heightToWidthRatio, this.perlinXStartTime, this.perlinYStartTime, this.initialColor, this.finalColor, this.saturation, this.fishName, this.distance));
    this.perlinXStartTime += 0.01;
    this.perlinYStartTime += 0.005;
    this.a += this.inc;
  }



  this.display = function() {
    this.segmentList.forEach(function (segment) {
      segment.display();
    });
  };

  this.move = function() {
    this.segmentList.forEach(function (segment) {
      segment.move();
    });
  };
}

// Fish segments, called by fish class
function Segment(segmentNumber, segmentHue, segmentX, segmentY, segmentSize, heightToWidthRatio, segmentPerlinXStartTime, segmentPerlinYStartTime, startColor, endColor, saturation, fishName, distance) {
  this.perlinXStartTime = segmentPerlinXStartTime;
  this.perlinYStartTime = segmentPerlinYStartTime;
  this.perlinXCurrentTime = this.perlinXStartTime;
  this.perlinYCurrentTime = this.perlinYStartTime;
  this.segmentBaseHue = segmentHue;
  this.segmentHue = segmentHue;
  this.segmentSaturation = saturation;
  this.segmentNumber = segmentNumber;
  this.distance = constrain(distance, 0, 2);

  // Sets the starting position of the fish
  this.x = segmentX;
  this.y = segmentY;
  this.segmentSize = segmentSize;

  this.display = function() {
    this.distance += 0.005;
    if (this.distance > 6) { this.distance = 6;}
    this.segmentLightness = darkness + (this.distance * 10);

    // Setting the color gradient
    if (this.segmentHue + fishColorChangeAmount < 1) {
    this.segmentHue = 360;
    } else {
      this.segmentHue = this.segmentHue - fishColorChangeAmount;
    }

    if(dist(this.x, this.y, mouseX, mouseY) < 150 && spotLightOn === true) {
      this.segmentLightness = darkness + (this.distance * 2) + 50;
    } else {
      this.segmentLightness = darkness + (this.distance * 2);
    }

    fill(this.segmentHue, this.segmentSaturation, this.segmentLightness);
    ellipse(this.x, this.y, (this.segmentSize/heightToWidthRatio) * (this.distance + 1), this.segmentSize * (this.distance + 1));

    if (this.segmentNumber === 10 && showName === true) {
      fill(200, 100, darkness+10, .5);
      textAlign(CENTER);
      textSize(32);
      text(fishName, this.x, this.y-50)
    }
  }

  this.move = function() {
    // Going backward through perlin time to make fish swim forward instead of backward
    this.perlinXCurrentTime -= 0.009;
    this.perlinYCurrentTime -= 0.002;
    perlinXValueSegment = noise(this.perlinXCurrentTime);
    perlinYValueSegment = noise(this.perlinYCurrentTime);
    this.x = map(perlinXValueSegment, 0, 1, 0 - (this.distance/4 * width), width + (this.distance/4 * width));
    this.y = map(perlinYValueSegment, 0, 1, 100, height);
  }

}