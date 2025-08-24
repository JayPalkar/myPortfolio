import "./style.scss";
import { TEXTURE_MAP } from "./constants";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Canvas
const canvas = document.querySelector("#portfolioCanvas");
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Texture Loader
const loadedTextures = {
  day: {},
  nightLightOff: {},
  nightLightOn: {},
};

Object.entries(TEXTURE_MAP).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;

  const nightLightOffTexture = textureLoader.load(paths.nightLightOff);
  nightLightOffTexture.flipY = false;
  nightLightOffTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.nightLightOff[key] = nightLightOffTexture;

  const nightLightOnTexture = textureLoader.load(paths.nightLightOn);
  nightLightOnTexture.flipY = false;
  nightLightOnTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.nightLightOn[key] = nightLightOnTexture;
});

// Object Loader
loader.load("/models/Portfolio_model_v2.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      Object.keys(TEXTURE_MAP).forEach((key) => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;

          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
    }
  });
  scene.add(glb.scene);
});

// Scene N Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(18.628652183389555, 14.94457844546518, 31.32241288603809);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(
  -0.8235149963276548,
  3.4261704474788774,
  -0.7296685568144353
);

// EventHandlers
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// LoopFunctions
const render = () => {
  controls.update();

  // console.log(camera.position);
  // console.log("/-----------------------/");
  // console.log(controls.target);

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();
