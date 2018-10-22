/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;
var num_balls = 5;
var scaling = 50;


var keys_pressed = {}; // stores the keys pressed
var objects = []; // Objects in the scene
var objects_colidable = []; // Objects in the scene that are colidable
var objects_named = {} // object that are named and need to be called
var balls_in_field = []

var clock = new THREE.Clock();

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    addObject(new LengthWall(scaling/2, 0, 0), "front");
    addObject(new LengthWall(-scaling/2, 0, 0), "back");
    addObject(new WidthWall(0, 0, scaling), "left");
    addObject(new WidthWall(0, 0, -scaling), "right");
    addObject(new FieldBase(0, 0, 0), "base", false)
    for (var i = 0; i < num_balls; i++) {
      balls_in_field.push(addObject(new FieldBall(balls_in_field)));
      console.log(objects_colidable)
    }
}


/**
 * Adds an object to the list of tracket objects in the scene
 * @param {EntidadeGrafica} object - The Object add with "new ObjectName(params)"
 * @param {string} name - (Optional) Name for referencing the object
 */
function addObject(object, name, colidable){
  if (typeof name !== "undefined"){ //if it is a named object
    if (objects_named[name] === "undefined") {
      console.log("give the object another name")
    } else {
      objects_named[name]=object;
    }
  }
  if (typeof colidable == "undefined" || colidable) {
    objects_colidable.push(object)
  }
  objects.push(object); // add object to the generic array of scene objects
  return object // returns object such that other function can catch its reference
}

/**
 * Gets an object of a specified name
 * @param {string} name - Name the object we want
 * @return {SceneObject} object - The Object being retrieved
 */
function getObject(name){
  if (objects_named[name] !== "undefined") {
    return objects_named[name]
  } else {
    console.log("error: object is not in the list")
  }
}

function createCamera() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    camera.lookAt(scene.position);
  onResize() // update to the scale once
}

function createCameraPerspective() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.x = 80;
  camera.position.y = 80;
  camera.position.z = 80;
  camera.lookAt(scene.position);
}

function createCameraFront() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1;
    camera.lookAt(scene.position);
}
function createCameraTop() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    camera.lookAt(scene.position);
}

function createCameraSide() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 1;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function onResize() {
  // TODO fix this function because it is wrong
  'use strict';

  var w = window.innerWidth;
  var h = window.innerHeight;
  var viewSize =  60 * (1 / h + 1 / w);
  camera.left = w / - 2 * viewSize;
  camera.right = w / 2 * viewSize;
  camera.top = h / 2 * viewSize;
  camera.bottom = h / - 2 * viewSize;
  camera.updateProjectionMatrix();
  renderer.setSize( w, h );
}

function onKeyUp(e) {
  'use strict';
  keys_pressed[e.keyCode]=false;
}

function onKeyDown(e) {
    'use strict';

    // getting the objects

    keys_pressed[e.keyCode]=true
    for (var key in keys_pressed) {
      if (!keys_pressed[key]) continue;
      switch (key) {
          case "66": //B
              break;
          case "37": // left
              break;
          case "38": // up
              break;
          case "39": // right
              break;
          case "40": // down
              break;
          case "49": // 1
              createCameraTop();
              break;
          case "50": // 2
              createCameraPerspective();
              break;
          case "51": // 3
              createCameraFront();
              break;
          case "52": // 4
              break;
          case "65": //A
              // assuming all submeshes inherit material from parent object
              for (var object in objects)
                // TODO add possibility for objects to have different materials
                objects[object].material.wireframe = !objects[object].material.wireframe;
              break
          case "83":  //S
              scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper)
                  node.visible = !node.visible;
              });
              break;
          case "115": //s
              break;
          case "69":  //E
          case "101": //e
              break;
      }
    }

}

function render() {
    'use strict';

    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    var delta = clock.getDelta();

    // Tentative Update
    objects.map( function(object) {
    	if (typeof object.tentativeUpdate === 'function') {
        	object.tentativeUpdate(delta);
    	}
    	if (typeof object.update === 'function') {
        	object.update(delta);
    	}
    });

    //objs_colision_detection(objects_colidable)

    // Tentative Update
    /*objects.map( function(object) {
      if (typeof object.update === 'function') {
        object.update(delta);
        //object.tentativeUpdate(delta);
      }
    });*/


    render();

    requestAnimationFrame(animate);
}
