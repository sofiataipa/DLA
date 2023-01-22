let walkers = [];
let nAliveWalkers = 0 ;
const N_INI_WALKERS = 100;
const N_WALKERS_PER_FRAME = 50;
const INIT_RADIUS = 23;
let counter = N_INI_WALKERS;
let startCounter;

let simStarted = false;
let endSim = false;

let radius = INIT_RADIUS;
let colorFactor = 100;
let DECREASE_RATE = 5;


function setup() {
  createCanvas(800, 800); 
}

function draw() {  
  background(230);
  noStroke();
  
  // ellipse on the center
  fill(235);
  ellipse(width/2, height/2, width*3/4, width*3/4);
  
  // walkers
  if(simStarted) {
    updateWalkers();
    
    if(!endSim) {
      if(nAliveWalkers < N_WALKERS_PER_FRAME) 
        generateWalkers(N_WALKERS_PER_FRAME - nAliveWalkers); 
    }
  }  
}

function generateWalkers(num) {
  for (let i = 0; i < num; i++) {
    let w = {
      pos: generateMousePos(),
      destination: generateBorderPos(),
      radius: getRadius(),
      walking: true,
      color: getColor(),
    }
    append(walkers, w);
    nAliveWalkers++;

    if(nAliveWalkers == N_INI_WALKERS) startCounter = true;
    if(startCounter) counter++;
  }
}

function updateWalkers() {  

  checkIfStopped();

  // update position of each walker
  walkers.forEach(w => {
    if(w.walking) {
      let step = p5.Vector.random2D();
      w.pos.add(step.mult(10));
      w.pos.lerp(w.destination, 0.005);
    }

    // choose color if dead or alive
    if(w.walking) fill(200, 100);
    else fill(w.color);
    // draw walker
    ellipse(w.pos.x, w.pos.y, w.radius, w.radius);
  });
  
}

function checkIfStopped() {
  walkers.forEach(w => {
    
    if(w.walking) {
      // check collision with border
      if(w.pos.x <= w.radius/2 ||
         w.pos.x >= width - w.radius/2 ||
         w.pos.y <= w.radius/2 ||
         w.pos.y >= height - w.radius/2) {
        
        w.walking = false;
        nAliveWalkers--;
      }

      else {
        //check collision with other walkers
        walkers.forEach(otherWalker => { 
          if(otherWalker !== w && !otherWalker.walking && w.pos.dist(otherWalker.pos) < w.radius) {
            w.walking = false;
            nAliveWalkers--;
          }
        }); 
      }
    }
  });
}

function generateBorderPos() {
  let border = int(random(0, 4)); // it will never be 4
  switch(border) {
    //top
    case 0:
      return createVector(random(0, width), 0);
    // left
    case 1:
      return createVector(0, random(0, height));
    //bottom  
    case 2:
      return createVector(random(0, width), height);
    //right
    case 3:
      return createVector(width, random(0, height));
  }
}

function mouseClicked() {
  if(!simStarted) {
    simStarted = true;
    generateWalkers(N_INI_WALKERS);
  }
}

function getRadius() {
  // rate at which the radius of each walker is reduce
  if(counter%DECREASE_RATE == DECREASE_RATE-1) {
     radius = radius* 0.96;
     colorFactor += 4; // also updates the color
     DECREASE_RATE += 5;
  }
  return radius < 10 ? 10 : radius; // never bellow 10
}

function getColor() {
  // calculate the color of each walker
  return color(210, colorFactor + random(-3, 3), colorFactor + random(-3, 3));
}

function generateMousePos() {
  // so the app doesn't crash
  let pos = createVector(mouseX, mouseY);
  walkers.forEach(w => {
    if(!w.walking && w.pos.dist(pos) < 20) {
      endSim = true;
      return null;
    } 
  });
  return pos;
}