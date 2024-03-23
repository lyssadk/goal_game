import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// positions
const picklePosition = {x: 6, y: 1.6, z: 3};
const picklePosition2 = {x: 6, y: 1.6, z: 3};
const bananaPosition = {x: -6, y: 1.6, z: 1};
const fishPosition = {x: 0, y: 1.6, z: 1};
const charSize = .25;


// rotations
const pickleRotation = {x: 0, y: 1, z: 0};
const bananaRotation = {x: 0, y: 1, z: 0};
const fishRotation = {x: 0, y: 1, z: 0};
// --------------------------
// Player class SETUP & saving/loading progress
// --------------------------

class Player {
  constructor(name, health, attack, defense, shield, specialBullets, invincibility, slowDownBullet, bigJump) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.shield = shield;
    this.specialBullets = specialBullets;
    this.invincibility = invincibility;
    this.slowDownBullet = slowDownBullet;
    this.bigJump = bigJump;
  }
  // getters and setters
  get name() {
    return this.name;
  }
  set name(name) {
    this.name = name;
  }
  get health() {
    return this.health;
  }
  set health(health) {
    this.health = health;
  }
  get attack() {
    return this.attack;
  }
  set attack(attack) {
    this.attack = attack;
  }
  get defense() {
    return this.defense;
  }
  set defense(defense) {
    this.defense = defense;
  }
  get shield() {
    return this.shield;
  }
  set shield(shield) {
    this.shield = shield;
  }
  get specialBullets() {
    return this.specialBullets;
  }
  set specialBullets(specialBullets) {
    this.specialBullets = specialBullets;
  }
  get invincibility() {
    return this.invincibility;
  }
  set invincibility(invincibility) {
    this.invincibility = invincibility;
  }
  get slowDownBullet() {
    return this.slowDownBullet;
  }
  set slowDownBullet(slowDownBullet) {
    this.slowDownBullet = slowDownBullet;
  }
  get bigJump() {
    return this.bigJump;
  }
  set bigJump(bigJump) {
    this.bigJump = bigJump;
  }

  saveProgress() {
    localStorage.setItem('player', JSON.stringify(this));
  }
  static loadProgress() {
    return JSON.parse(localStorage.getItem('player'));
  }
}


// --------------------------
// ENEMY CLASS SETUP
// --------------------------
class Enemy {
  constructor(name, health, attack, defense, abilities, speed, position) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.abilities = abilities;
    this.speed = speed;
    this.position = position;
  }

  // getters and setters
  get name() {
    return this.name;
  }
  set name(name) {
    this.name = name;
  }
  get health() {
    return this.health;
  }
  set health(health) {
    this.health = health;
  }
  get attack() {
    return this.attack;
  }
  set attack(attack) {
    this.attack = attack;
  }
  get defense() {
    return this.defense;
  }
  set defense(defense) {
    this.defense = defense;
  }
  get abilities() {
    return this.abilities;
  }
  set abilities(abilities) {
    this.abilities = abilities;
  }
  get speed() {
    return this.speed;
  }
  set speed(speed) {
    this.speed = speed;
  }
  get position() {
    return this.position;
  }
  set position(position) {
    this.position = position;
  }
}

// --------------------------
// WEAPON CLASS SETUP
// --------------------------
class Weapon {
  constructor(name, attack) {
    this.name = name;
    this.attack = attack;
  }
  constructor(name, attack, specialEffect) {
    this.name = name;
    this.attack = attack;
    this.specialEffect = specialEffect;
  }
  // getters and setters
  get name() {
    return this.name;
  }
  set name(name) {
    this.name = name;
  }
  get attack() {
    return this.attack;
  }
  set attack(attack) {
    this.attack = attack;
  }
}



// --------------------------
// all powerups/abilities + their functions
// --------------------------
let shieldN;
let specialBulletsM;
let invincibilityI;
let slowDownBulletL;
let bigJumpV;

//create a jump function that makes the player jump higher
function bigJump() {
  function up() {
    player.position.y += 2;
    
  }
  function down() {
    player.position.y -= 2;
    
  }
  function jump() {
    up();
    setTimeout(down, 150);
  }

  jump();

}

// create a shield that lasts 5 seconds
function createShield() {
  const shield = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5})
  );
  shield.position.set(player.position.x, player.position.y -.7, player.position.z);
  scene.add(shield);
  setTimeout(() => {
    scene.remove(shield);
  }, 5000);
}
// create bullets that when they hit the enemy, slows the enemy down
// im aware i could def simplify this code cause im repeating the same stuff for the bullets but i
// wanted to make sure i could get the bullets to work first
function slowDownBullets(){
  const slowBullets=[];
  const slowBullet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  )
  slowBullet.position.set(player.position.x, player.position.y - 1, player.position.z);
  slowBullet.velocity = new THREE.Vector3(0, 0, -1);
  slowBullets.push(slowBullet);
  scene.add(slowBullet)
  function moveSlowBullets() {
    slowBullets.forEach((slowBullet) => {
      slowBullet.position.add(slowBullet.velocity);
    });
  }
  function removeSlowBullets() {
    slowBullets.forEach((slowBullet) => {
      if (slowBullet.position.z < -10) {
        scene.remove(slowBullet);
      }
    });
  }
  function detectCollision() {
    slowBullets.forEach((slowBullet) => {
      littleEnemies.forEach((enemy) => {
        if (slowBullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(slowBullet);
          // figure out how to slow the enemy when collision is detected

        }
      });
      enemies.forEach((enemy) => {
        if (slowBullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(slowBullet);
          // figure out how to slow the enemy when collision is detected

        }
      });
    });
  }
  function animateSlowBullets() {
    moveSlowBullets();
    removeSlowBullets();
    detectCollision();
  }
  setInterval(animateSlowBullets, 1000 / 20);
}
// create the speedy powered-up bullets
function specialBullets() {
  
  const bullets =[];
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffcc22 })
  );
  bullet.position.set(player.position.x, player.position.y - 1, player.position.z);
  bullet.velocity = new THREE.Vector3(0, 0, -2);
  bullets.push(bullet);
  scene.add(bullet);
  function moveBullets() {
    bullets.forEach((bullet) => {
      bullet.position.add(bullet.velocity);
  });}
  function removeBullets() {
    bullets.forEach((bullet) => {
      if (bullet.position.z < -30) {
        scene.remove(bullet);
      }
    });
  }
  function detectCollision() {
    bullets.forEach((bullet) => {
      littleEnemies.forEach((enemy) => {
        if (bullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(bullet);
          scene.remove(enemy);
        }
      });
      enemies.forEach((enemy) => {
        if (bullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(bullet);
          scene.remove(enemy);
        }
      });
    });
  }
  function animateBullets() {
    moveBullets();
    removeBullets();
    detectCollision();
  }
  
  setInterval(animateBullets, 1000 / 80);
  
}


// --------------------------
// SCENE SETUP
// --------------------------

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement ); 

// Camera
// camera watches the scene from a distance when button is pushed

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z=4.5;
camera.position.y=1.5;



// Ground
const ground = new THREE.Mesh(
  new THREE.BoxGeometry( 15, 1, 30 ),
  new THREE.MeshPhongMaterial( { color: 0x00aaaa } )
); 
ground.position.y = -1;
scene.add( ground ); 

// world???

//load the vancouver model as the world
const world = new GLTFLoader();
world.load('vancouver.glb', (gltf) => {
  const vancouver = gltf.scene;
  vancouver.scale.set(6,6, 6);
  vancouver.position.y = 1;
  scene.add(vancouver);
});
//load a sphere as a world
// const geometry = new THREE.SphereGeometry( 4, 32, 16 ); 
// const material = new THREE.MeshPhongMaterial( { color: 0xa0aaa } ); 
// const sphere = new THREE.Mesh( geometry, material ); 
// sphere.position.y = 3;
// scene.add( sphere );


// --------------------------
// NPC INTERACTIONS
// --------------------------
// when the fish shoots the banana, the banana will make a pop up message 
// saying "You are close to the banana"

// when the fish gets close to the pickle, the pickle will make a pop up message
// saying "You are close to the pickle"

//--------------------------------
//// GLTF MODEL LOADER
////-----------------------------------

let player;
// Load a gltf model and put him on the sphere
const loader = new GLTFLoader();
loader.load('Fish.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(charSize, charSize, charSize);
  // make sure the fish is on the sphere but not in the sphere lol
  player.position.set(fishPosition.x, fishPosition.y, fishPosition.z);
  
  player.rotateY(fishRotation.y);
  ground.add(player);

  const playerHealthBar = new THREE.Mesh(
    new THREE.BoxGeometry( 1, 0.1, 0.1 ),
    new THREE.MeshPhongMaterial( { color: 0xff0000 } )
  )
  
  playerHealthBar.position.set(player.position.x, player.position.y, player.position.z)
  scene.add(playerHealthBar)
  // add event listener to the fish
 window.addEventListener('keydown', (event) => {
    if (event.key === 'd' || event.key === 'ArrowRight') {
      player.position.x += 1;
      playerHealthBar.position.x += 1;
    }
    if (event.key === 'a' || event.key === 'ArrowLeft') {
      player.position.x -= 1;
      playerHealthBar.position.x -= 1;
    }
    if (event.key === 'w'|| event.key === 'ArrowUp') {
      player.position.z -= 1;
      playerHealthBar.position.z -= 1;
    }
    if (event.key === 's' || event.key === 'ArrowDown') {
      player.position.z += 1;
      playerHealthBar.position.z += 1;
    }
    if (event.key === 'b') {
      // basic bullets
      shootBullets();
    }
    if (event.key === 'n' && shieldN === true) {
      // shield
      createShield();
    }
    if (event.key === 'm' && specialBulletsM === true) {
      // special bullets
      specialBullets();
    }
    if (event.key === 'i' && invincibilityI === true) {
      // invibility
    }
    if (event.key === 'l' && slowDownBulletL === true) {
      // slow down bullets
      slowDownBullets();
    }
    if (event.key === 'v' && bigJumpV === true) {
      // big jump
      bigJump();
    }
  });

});

let banana;
// load the banana model and put him on the gorund
loader.load('banana.glb', (gltf) => {
  banana = gltf.scene;
  banana.scale.set(charSize, charSize, charSize);
  banana.position.set(bananaPosition.x, bananaPosition.y, bananaPosition.z);
  ground.add(banana);

});

let pickle;
//load the pickle model and put him on the ground
loader.load('pickle.glb', (gltf) => {
  pickle = gltf.scene;
  pickle.scale.set(charSize, charSize, charSize);
  pickle.position.set(picklePosition.x, picklePosition.y, picklePosition.z);
  pickle.rotateY(pickleRotation.y);
  ground.add(pickle);
  
});

// -----------------------------
// HEALTH BAR
// -----------------------------



const redTargetBar = new THREE.Mesh(
  new THREE.BoxGeometry( 1, 0.1, 0.1 ),
  new THREE.MeshPhongMaterial( { color: 0xff0000 } )
)





//--------------------------------
//// FONT LOADER
////-----------------------------------
const font = new FontLoader();
font.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font) => {
    const color = 0x006699;
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    }); 
    const message = "Pickle Dude";
    const shapes = font.generateShapes(message, 1);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
     // Define a scale factor to shrink the font loader
     const scaleFactor1 = 0.1; // Adjust as needed
     // Apply the scale to the geometry
     geometry.scale(scaleFactor1, scaleFactor1, scaleFactor1);
   
    const text = new THREE.Mesh(geometry, matLite);

    
    text.position.set(picklePosition2.x, picklePosition2.y +.3, picklePosition2.z);
    scene.add(text);
    // banana text
    const message2 = "Banana Dude";
    const shapes2 = font.generateShapes(message2, 1);
    const geometry2 = new THREE.ShapeGeometry(shapes2);
    geometry2.computeBoundingBox();
    geometry2.translate(xMid, 0, 0);
     // Define a scale factor to shrink the font loader
     const scaleFactor2 = 0.1; // Adjust as needed
     // Apply the scale to the geometry
     geometry2.scale(scaleFactor2, scaleFactor2, scaleFactor2);
    const text2 = new THREE.Mesh(geometry2, matLite);
    text2.position.set(bananaPosition.x, bananaPosition.y+.5, bananaPosition.z);
    scene.add(text2);

    // fish health percentage
    const message3 = "Health: 100%";
    const shapes3 = font.generateShapes(message3, 1);
    const geometry3 = new THREE.ShapeGeometry(shapes3);
    geometry3.computeBoundingBox();
    geometry3.translate(xMid, 0, 0);
    // Define a scale factor to shrink the font loader
    const scaleFactor = 0.1; // Adjust as needed
    // Apply the scale to the geometry
    geometry3.scale(scaleFactor, scaleFactor, scaleFactor);

    const text3 = new THREE.Mesh(geometry3, matLite);
    text3.position.set(fishPosition.x, fishPosition.y+.2, fishPosition.z);
    scene.add(text3);
  })


//-------------------------------
// BASIC CHARACTER ABILITIES 
//-------------------------------

// create the basic bullets
function shootBullets() {
  const bullets = [];
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  bullet.position.set(player.position.x, player.position.y - 1 , player.position.z);
  bullet.velocity = new THREE.Vector3(0, 0, -1);
  scene.add(bullet);
  bullets.push(bullet);

  function moveBullets() {
    bullets.forEach((bullet) => {
      bullet.position.add(bullet.velocity);
    });
  }
  function removeBullets() {
    bullets.forEach((bullet) => {
      if (bullet.position.z < -10) {
        scene.remove(bullet);
      }
    });
  }
  function detectCollision() {
    bullets.forEach((bullet) => {
      littleEnemies.forEach((enemy) => {
        if (bullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(bullet);
          scene.remove(enemy);
          
        }
      });
      enemies.forEach((enemy) => {
        if (bullet.position.distanceTo(enemy.position) < 0.5) {
          scene.remove(bullet);
          scene.remove(enemy);
          
        }
      });
      // detect if they hit the banana
      if (bullet.position.distanceTo(banana.position) < 0.5) {
        console.log('You hit the banana');
        // pop up message
        

      }
      // detect if they hit the pickle
      if (bullet.position.distanceTo(pickle.position) < 0.5) {
        console.log('You hit the pickle');
        // pop up message
      }
    });
  }
  function animateBullets() {
    moveBullets();
    removeBullets();
    detectCollision();
  }
  setInterval(animateBullets, 1000 / 40);
}

// --------------------------
// ENEMY INTERACTIONS
// --------------------------

// create a practice dummy that shoots back
const littleEnemies = [];
const enemies = [];
const enemy = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 8, 8),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
enemy.position.set(0, 0, -15);
scene.add(enemy);
enemies.push(enemy);

//animate sphere to rotate around the y axis 
function animateSphere() {
  requestAnimationFrame(animateSphere);
  sphere.rotation.y += .0001;
}


// Lighting
  const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( hemLight );
  const color = 0xFFFFFF;
  const intensity = 1.3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 1,-1);
  scene.add(light);


//orbit controls
const controls = new OrbitControls(camera, renderer.domElement);




// actually render the scene and call all the fun stuff
function animate() {
 // detectCollision();
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}



// badabing badaboom
animate();




// okay so here is some of my logic i need to code out lol:
// When they interact with an npc to upgrade an ability, it needs to save the users progress in a database
// When they load the game, it needs to load the users progress from the database
// get the player class functionality smoother
// have the red target move towards the player when they are near and start shooting at them




