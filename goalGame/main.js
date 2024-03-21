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

// Load a gltf model and put him on the sphere
const loader = new GLTFLoader();
loader.load('Fish.glb', (gltf) => {
  const fishDude = gltf.scene;
  fishDude.scale.set(charSize, charSize, charSize);
  // make sure the fish is on the sphere but not in the sphere lol
  fishDude.position.set(fishPosition.x, fishPosition.y, fishPosition.z);
  ground.add(fishDude);
  // add event listener to the fish
 window.addEventListener('keydown', (event) => {
    if (event.key === 'f') {
      fishDude.position.x += 1;
    }
    if (event.key === 'a') {
      fishDude.position.x -= 1;
    }
    if (event.key === 'w') {
      fishDude.position.z -= 1;
    }
    if (event.key === 's') {
      fishDude.position.z += 1;
    }
  });

});
// load the banana model and put him on the gorund
loader.load('banana.glb', (gltf) => {
  const banana = gltf.scene;
  banana.scale.set(charSize, charSize, charSize);
  banana.position.set(bananaPosition.x, bananaPosition.y, bananaPosition.z);
  ground.add(banana);
});

//load the pickle model and put him on the ground
loader.load('pickle.glb', (gltf) => {
  const pickle = gltf.scene;
  pickle.scale.set(charSize, charSize, charSize);
  pickle.position.set(picklePosition.x, picklePosition.y, picklePosition.z);
  pickle.rotateY(1);
  ground.add(pickle);
  
});
const font = new FontLoader();
font.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font) => {
    const color = 0x006699;
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    }); 
    const message = "Pickle Dude";
    const shapes = font.generateShapes(message, 1);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);

   
    const text = new THREE.Mesh(geometry, matLite);

    
    text.position.set(picklePosition2.x, picklePosition2.y, picklePosition2.z);
    scene.add(text);
    // banana text
    const message2 = "Banana Dude";
    const shapes2 = font.generateShapes(message2, 1);
    const geometry2 = new THREE.ShapeGeometry(shapes2);
    geometry2.computeBoundingBox();
    geometry2.translate(xMid, 0, 0);
    const text2 = new THREE.Mesh(geometry2, matLite);
    text2.position.set(bananaPosition.x, bananaPosition.y, bananaPosition.z);
    scene.add(text2);
  })

// load a gltf model and put him on the sphere

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
  
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}

// badabing badaboom
animate();








