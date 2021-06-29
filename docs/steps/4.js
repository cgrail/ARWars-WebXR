import { initAR, getPositionWithOffset } from "./ARHelper.js";
import { GameAssets } from "./GameAssets.js";
import { playLaserFireSound, playExplosionSound } from "./Audio.js";

const { THREE, scene, camera, controller } = initAR(onSelect);

var tieFighter;

async function spawnFighter() {
  if (!tieFighter) {
    tieFighter = await GameAssets.loadTieFighter();
  }
  const targetPosition = getPositionWithOffset(2);
  targetPosition.setX(-Math.random());
  targetPosition.setY(Math.random());
  const position = getPositionWithOffset(10);
  position.setX(Math.random() * 5);
  position.setY(Math.random());
  tieFighter.position.copy(position);
  tieFighter.quaternion.setFromRotationMatrix(controller.matrixWorld);
  const tween = new TWEEN.Tween(position).to(targetPosition, 2000);
  tween.onUpdate(() => {
    tieFighter.position.copy(position);
    tieFighter.lookAt(camera.position);
  });
  tween.start();
  scene.add(tieFighter);
}

function onSelect() {
  playLaserFireSound();
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
  const endPosition = new THREE.Vector3(0, 0, -10).applyMatrix4(
    controller.matrixWorld
  );
  const tween = new TWEEN.Tween(position).to(endPosition, 2000);
  tween.onUpdate(() => {
    laser.position.copy(position);
  });
  tween.start();
  tween.onComplete(() => {
    scene.remove(laser);
  });
  scene.add(laser);
}

spawnFighter();
