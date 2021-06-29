import { ARButton } from './threejs/ARButton.js';

let container;
let controller;

function init(THREE, scene, camera, renderer, render, reticle) {

    container = document.createElement( 'div' );
    document.body.appendChild( container );


    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    light.position.set( 0.5, 1, 0.25 );
    scene.add( light );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

    const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

    function onSelect() {

        if ( reticle.visible ) {

            const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
            const mesh = new THREE.Mesh( geometry, material );
            mesh.position.setFromMatrixPosition( reticle.matrix );
            mesh.scale.y = Math.random() * 2 + 1;
            scene.add( mesh );

        }

    }

    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', onSelect );
    scene.add( controller );

    reticle = new THREE.Mesh(
        new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add( reticle );

    window.addEventListener( 'resize', function (){

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    } );

    renderer.setAnimationLoop( render );

}



export {
    init
}