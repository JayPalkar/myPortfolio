import "./style.scss";
import { SOCIAL_LINKS, TEXTURE_MAP } from "./constants";

import * as THREE from "three";
import { OrbitControls } from "./utils/orbitControls";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

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

let isModalOpen = false;

document.querySelectorAll(".modalExitButton").forEach((button) => {
  button.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    hideModal(modal);
  });
  button.addEventListener("touchend", (e) => {
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
loader.load("/models/Portfolio_model_v5.glb", (glb) => {
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

          if (child.name.includes("hover")) {
            child.userData.initialScale = new THREE.Vector3().copy(child.scale);
            child.userData.initialPosition = new THREE.Vector3().copy(
              child.position
            );
            child.userData.initialRotation = new THREE.Euler().copy(
              child.rotation
            );
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 5;
controls.maxDistance = 35;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2;

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
if (window.innerWidth < 750) {
  camera.position.set(9.373120475943182, 16.932596593263817, 46.31929612694968);
  controls.target.set(
    -0.8235149963276548,
    3.4261704474788774,
    -0.7296685568144353
  );
} else {
  camera.position.set(18.628652183389555, 14.94457844546518, 31.32241288603809);
  controls.target.set(
    -0.8235149963276548,
    3.4261704474788774,
    -0.7296685568144353
  );
}

// EventHandlers
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// support functions
const handleRaycasterInteraction = () => {
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
};

const showModal = (modal) => {
  modal.style.display = "block";
  isModalOpen = true;
  controls.enabled = false;

  document.body.style.cursor = "default";
  currentIntersects = [];

  gsap.set(modal, { opacity: 0 });
  gsap.to(modal, { opacity: 1, duration: 0.5 });
};

const hideModal = (modal) => {
  isModalOpen = false;
  controls.enabled = true;
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      modal.style.display = "none";
    },
  });
};

// Event listeners
window.addEventListener("mousemove", (e) => {
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener(
  "touchstart",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);
window.addEventListener(
  "touchend",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    handleRaycasterInteraction();
  },
  { passive: false }
);
window.addEventListener("click", handleRaycasterInteraction);

// loopFunction
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
  if (!isModalOpen) {
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
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();
