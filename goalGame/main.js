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
  new THREE.BoxGeometry( 10, 1, 10 ),
  new THREE.MeshPhongMaterial( { color: 0x00aaaa } )
); 
ground.position.y = -1;
scene.add( ground ); 

// Lighting
function addLight(x, y, z) {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  scene.add(light);
}

//orbit controls
const controls = new OrbitControls(camera, renderer.domElement);


// actually render the scene and call all the fun stuff
function animate() {
  addLight(-1, 2, 4);
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}

// badabing badaboom
animate();








