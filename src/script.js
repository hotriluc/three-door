import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Debugger
 */
const gui = new dat.GUI();

/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAmbientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
const matcapsTexture = textureLoader.load("/textures/matcaps/3.png");

const environmentTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
// const material = new THREE.MeshBasicMaterial();
// // material.wireframe = true;

// material.map = doorColorTexture;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapsTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("red");

// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter;
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

const doorMaterial = new THREE.MeshStandardMaterial();
doorMaterial.map = doorColorTexture;
doorMaterial.metalness = 0;
doorMaterial.roughness = 1;
doorMaterial.metalnessMap = doorMetalnessTexture;
doorMaterial.roughnessMap = doorRoughnessTexture;
doorMaterial.aoMap = doorAmbientTexture;
doorMaterial.displacementMap = doorHeightTexture;
doorMaterial.displacementScale = 0.05;
doorMaterial.normalMap = doorNormalTexture;
doorMaterial.transparent = true;
doorMaterial.alphaMap = doorAlphaTexture;
doorMaterial.side = THREE.DoubleSide;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.45;
material.roughness = 0;
material.envMap = environmentTexture;

gui
  .add(doorMaterial, "metalness")
  .min(0)
  .max(1)
  .step(0.0001)
  .name("door metalness");
gui
  .add(doorMaterial, "roughness")
  .min(0)
  .max(1)
  .step(0.0001)
  .name("door roughness");

gui.add(material, "metalness").min(0).max(1).step(0.0001).name(" metalness");
gui.add(material, "roughness").min(0).max(1).step(0.0001).name(" roughness");

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  doorMaterial
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

// plane.position.z = -3;
sphere.position.x = -1.5;
torus.position.x = 1.5;

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
scene.add(plane, sphere, torus);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // sphere.rotation.y = 0.2 * elapsedTime;
  // plane.rotation.y = 0.2 * elapsedTime;
  // torus.rotation.y = 0.2 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // plane.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
