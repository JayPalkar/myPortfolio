import "./style.scss";
import { SOCIAL_LINKS, TEXTURE_MAP } from "./constants";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { hideModal, showModal } from "./animationFunctions";

// Canvas
const canvas = document.querySelector("#portfolioCanvas");
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const modals = {
  mail: document.querySelector("#mail"),
  abouts: document.querySelector("#abouts"),
};

const exitButton = document
  .querySelectorAll("#modalExitButton")
  .forEach((button) => {
    button.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      hideModal(modal);
    });
  });

const cpuFans = [];

const raycasterObjects = [];
let currentIntersects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

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
loader.load("/models/Portfolio_model_v3.glb", (glb) => {
  glb.scene.traverse((child) => {
    if (child.isMesh) {
      Object.keys(TEXTURE_MAP).forEach((key) => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;

          if (child.name.includes("fan")) {
            cpuFans.push(child);
          }

          if (child.name.includes("raycaster") && !child.name.includes("fan")) {
            raycasterObjects.push(child);
          }
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

window.addEventListener("mousemove", (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", (e) => {
  if (currentIntersects.length > 0) {
    const object = currentIntersects[0].object;
    Object.entries(SOCIAL_LINKS).forEach(([key, url]) => {
      if (object.name.includes(key)) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer";
      }
    });

    if (object.name.includes("mail_box")) {
      showModal(modals.mail);
    } else if (object.name.includes("about_me")) {
      showModal(modals.abouts);
    }
  }
});

// LoopFunctions
const render = () => {
  controls.update();

  // console.log(camera.position);
  // console.log("/-----------------------/");
  // console.log(controls.target);

  //cpu fans animation
  cpuFans.forEach((cpuFan) => {
    cpuFan.rotation.z += 0.1;
  });

  // raycaster
  raycaster.setFromCamera(pointer, camera);

  currentIntersects = raycaster.intersectObjects(raycasterObjects);

  for (let i = 0; i < currentIntersects.length; i++) {}

  if (currentIntersects.length > 0) {
    const currentIntersectObject = currentIntersects[0].object;
    if (currentIntersectObject.name.includes("pointer")) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  } else {
    document.body.style.cursor = "default";
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();
