import { ARButton } from "https://threejs.org/examples/jsm/webxr/ARButton.js";
import * as THREE from "https://threejs.org/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  20
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

function initAR(onSelect, onRender) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  function render(timestamp, frame) {
    TWEEN.update();
    if (onRender) {
      onRender(frame);
    }
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);

  return {
    THREE,
    scene,
    camera,
    controller,
  };
}

export { initAR };
