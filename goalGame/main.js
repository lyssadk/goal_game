import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement ); 

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z=4.5;
camera.position.y=1.5;


// Ground
const ground = new THREE.Mesh(
  new THREE.BoxGeometry( 2, 1, 1 ),
  new THREE.MeshPhongMaterial( { color: 0x00aaaa } )
); 
ground.position.y = -1;
scene.add( ground ); 

// world???
const geometry = new THREE.SphereGeometry( 4, 32, 16 ); 
const material = new THREE.MeshPhongMaterial( { color: 0xa0aaa } ); 
const sphere = new THREE.Mesh( geometry, material ); 
sphere.position.y = 3;
scene.add( sphere );

// Load a gltf model and put him on the sphere
const loader = new GLTFLoader();
loader.load('Fish.glb', (gltf) => {
  const fishDude = gltf.scene;
  fishDude.scale.set(0.5, 0.5, 0.5);
  // make sure the fish is on the sphere but not in the sphere lol
  fishDude.position.set(0, 3.9, 1);
  
  sphere.add(fishDude);
});

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
  animateSphere();
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}

// badabing badaboom
animate();








