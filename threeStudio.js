import * as THREE from "./three.js-master/src/Three.js";
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { TrackballControls } from './three.js-master/examples/jsm/controls/TrackballControls.js';
import { GUI } from './three.js-master/examples/jsm/libs/dat.gui.module.js';

let settings, model, renderer, scene, camera, panel, controls, center;

const params = {
    exposure: 0.02,
    toneMapping: 'ACESFilmic'
};

const toneMappingOptions = {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
    Custom: THREE.CustomToneMapping
};

function init(){

    renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.02;
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);
    camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight,0.01,50000);
   
    camera.lookAt( 0, 0, 0 );

    // orbit = new TrackballControls(camera, renderer.domElement);

    // orbit.rotateSpeed = 1.0;
    // orbit.zoomSpeed = 1.0;
    // orbit.panSpeed = 1.0;

    // orbit.controls = ['KeyA', 'KeyS', 'KeyD'];

    scene.add(new THREE.AxesHelper(5000));

    camera.position.set( 0, 0, 20);
    // orbit.update();
    // //orbit.addEventListener('change', renderer.render(scene, camera));


    // controls = new TransformControls(camera, renderer.domElement);
    // // controls.addEventListener('change', renderer.render(scene, camera));

    // controls.addEventListener('dragging-changed', function(event){
    //      orbit.enabled =! event.value;
    // });



    /**
     * Lights
     * ---------------------------------------------------------------
     */

    // const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
    // scene.add(hemiLight);

    // const spotLight = new THREE.SpotLight();
    // spotLight.position.set(0,5,2);
    // scene.add(spotLight);

    const hlight = new THREE.AmbientLight ();
    scene.add(hlight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff);
    // directionalLight.position.set(0,1,0);
    // directionalLight.castShadow = true;
    // scene.add(directionalLight);

    // const light = new THREE.PointLight(0xc4c4c4);
    // light.position.set(0,0,100);
    // scene.add(light);

    // const light2 = new THREE.PointLight(0xc4c4c4);
    // light2.position.set(500,100,0);
    // scene.add(light2);

    // const light3 = new THREE.PointLight(0xc4c4c4);
    // light3.position.set(0,100,-500);
    // scene.add(light3);

    // const light4 = new THREE.PointLight(0xc4c4c4);
    // light4.position.set(-500,300,500);
    // scene.add(light4);

    /**
     * ---------------------------------------------------------------
     */
    

    const loader = new GLTFLoader();

    loader.load('./model/Overall view.glb', function(gltf){

        const box = new THREE.Box3().setFromObject( gltf.scene );
        model = gltf.scene;

        center = box.getCenter(new THREE.Vector3() );
        //model.scale.multiplyScalar(1/100);
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        //model.userData.draggable = true;
        scene.add(model);
        createPanel();
        renderer.render(scene, camera);
        animate();
    }, undefined, function(error){
        console.log(error);
    });
    
    window.addEventListener( 'resize' , onWindowResize);

    window.addEventListener('keydown', function(event){
        onDocumentKeyDown(event);
    });

    createControl(camera);

    function animate(){
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

    }
}

function createControl(camera){
    controls = new TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.1;

    controls.controls = ['KeyA', 'KeyS', 'KeyD'];

}

function createPanel(){
    panel = new GUI({ width: window.addEventListener('resize', function(event){
        this.window.innerWidth-20;
    })});
    const folder1 = panel.addFolder( 'test1' );
    const folder2 = panel.addFolder( 'test2' );

    settings = {
        'show model': true
    }

    folder1.add(settings, 'show model').onChange(showModel);
    folder1.add(params, 'exposure', 0, 1.5).onChange(function(){
        renderer.toneMappingExposure = params.exposure;
        renderer.render(scene, camera);
    });

    folder1.open();
}

function showModel(visibility){
    model.visible = visibility;
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    renderer.render(scene, camera);
}

function onDocumentKeyDown(event){
    var keyCode = event.which;
    switch(keyCode){
        case 87 || 38: // W 38
            //number -= 0.1;
            model.position.z += 2;
            break;
        case 83 || 40: // E 40 arrow down
            model.position.z -= 2;
            break;

        case 69:
            model.position.x += 2;
            break;
        
        case 68:
            model.position.x -= 2;
            break;

        case 81:
            model.position.y += 2;
            break;

        case 65:
            model.position.y -= 2;
            break;
        
        case 82:
            model.position.x = 0;
            model.position.y = 0;
            model.position.z = 0;
    }
}

init();