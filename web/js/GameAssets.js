import { OBJLoader } from "https://threejs.org/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejs.org/examples/jsm/loaders/MTLLoader.js";

function loadObj(material, objFile) {
  return new Promise((resolve) => {
    new MTLLoader().load(material, function (materials) {
      materials.preload();
      new OBJLoader().setMaterials(materials).load(objFile, function (object) {
        var scale = 0.1;
        object.scale.set(scale, scale, scale);
        resolve(object);
      });
    });
  });
}

async function loadTieFighter() {
  return await loadObj("./assets/materials.mtl", "./assets/tie.obj");
}

function explode(THREE, scene) {
  var material = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(generateSprite()),
    blending: THREE.AdditiveBlending,
  });
  for (var i = 0; i < 100; i++) {
    var particle = new THREE.Sprite(material);
    initParticle(particle, i * 10);
    scene.add(particle);
  }
}

function generateSprite() {
  var canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext("2d");
  var gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(0,255,255,1)");
  gradient.addColorStop(0.4, "rgba(0,0,64,1)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function initParticle(particle) {
  particle.position.set(0, 0, 0);
  particle.scale.x = particle.scale.y = Math.random() * 32 + 16;
  var duration = 1000;
  new TWEEN.Tween(particle).to({}, duration).start();
  new TWEEN.Tween(particle.position)
    .to(
      {
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 1000 - 500,
        z: Math.random() * 4000 - 2000,
      },
      duration
    )
    .start();
  new TWEEN.Tween(particle.scale)
    .to(
      {
        x: 0.01,
        y: 0.01,
      },
      duration
    )
    .start();
}

function playExplosionSound() {
  var explosion = new Audio("./assets/Explosion.mp3");
  explosion.play();
}

function playLaserFireSound() {
  var laserFire = new Audio("assets/Laser.mp3");
  laserFire.play();
}

const GameAssets = {
  loadTieFighter,
  explode,
  playExplosionSound,
  playLaserFireSound,
};

export { GameAssets };
