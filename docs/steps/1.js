import { initAR, getPositionWithOffset } from "./ARHelper.js";
import { GameAssets } from "./GameAssets.js";

const { THREE, scene, controller } = initAR(onSelect);

function onSelect() {
  const geometry = new THREE.BoxGeometry(0.03, 0.03, 2);
  const material = new THREE.MeshBasicMaterial({
    color: "red",
  });
  const laser = new THREE.Mesh(geometry, material);
  var position = new THREE.Vector3(0, -0.1, -0.5).applyMatrix4(
    controller.matrixWorld
  );
  laser.position.copy(position);
  laser.quaternion.setFromRotationMatrix(controller.matrixWorld);
  scene.add(laser);
}

spawnFighter();
