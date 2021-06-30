import { initAR, getPositionWithOffset } from "./ARHelper.js";

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
  // ----------------START------------------------------
  const endPosition = new THREE.Vector3(0, 0, -10).applyMatrix4(
    controller.matrixWorld
  );
  const tween = new TWEEN.Tween(position).to(endPosition, 2000);
  tween.onUpdate(() => {
    laser.position.copy(position);
  });
  tween.start();
  // ----------------PAUSE------------------------------
  tween.onComplete(() => {
    scene.remove(laser);
  });
  // ----------------END--------------------------------
}
