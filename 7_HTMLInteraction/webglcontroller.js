var viewPortWidth = 600;
var viewPortHeight = 600;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, viewPortWidth / viewPortHeight, 0.1, 1000);
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var shouldRotate = false;
var Sphere;
var Cube;
var tetrahedron;
var tracer;

var renderer;

if ( webglAvailable() ) {
		renderer = new THREE.WebGLRenderer();
	} else {
		renderer = new THREE.CanvasRenderer();
	}

renderer.setSize(viewPortWidth, viewPortHeight);
var viewport = document.getElementById("JamesWebGlViewPort");
viewport.appendChild(renderer.domElement);

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 2);
camera.add(pointLight);
camera.position.z = 5;
scene.add(camera);


function addTieFighter(position)
{


    var loader = new THREE.ObjectLoader();
    //loader.load("json/tiefighter/star-wars-vader-tie-fighter.json", function (obj) {
    loader.load("json/turtle/untitled-scene.json", function (obj) {
        obj.position.set(position.x, position.y, position.z);
        obj.rotation.y = Math.PI;
        obj.scale.set(2.5,2.5,2.5);
        scene.add(obj);
    });
}
    

var startRotate = function ()
{
    shouldRotate = true;
}

var stopRotate = function () 
{
    shouldRotate = false;
}

function webglAvailable() {
		try {
			var canvas = document.createElement( 'canvas' );
			return !!( window.WebGLRenderingContext && (
				canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
			);
		} catch ( e ) {
			return false;
		}
	}


function applyTracer(type) 
{
    if (tracer)  scene.remove(tracer);
    
    var materialuu = new THREE.MeshPhongMaterial({ color: 0x1355d5, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var totot = getXY(mouse.x, mouse.y);
    
    if (type == "cube") 
    {
        var testBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        tracer = new THREE.Mesh(testBoxGeometry, materialuu);
                    
        tracer.position.set(totot.x, totot.y, totot.z);
        scene.add(tracer);
    } else if (type == "sphere") 
    {
        var testSphereGeometry = new THREE.SphereGeometry(1, 20, 20);
        var lam = new THREE.MeshLambertMaterial({ color: 0x1355d5 });
        tracer = new THREE.Mesh(testSphereGeometry, lam);
        tracer.position.set(totot.x, totot.y, totot.z);
        scene.add(tracer);
    } else if (type == "tetrahedron") 
    {
        var geometryf = new THREE.OctahedronGeometry()
        var materiafl = new THREE.MeshPhongMaterial({ color: 0x1355d5, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
        tracer = new THREE.Mesh(geometryf, materiafl);
        tracer.position.set(totot.x, totot.y, totot.z);
        scene.add(tracer);
    }
}

var render = function () 
{
    requestAnimationFrame(render);

    updateRenderLoop();
    
    renderer.render(scene, camera);
    
};

function updateRenderLoop()
{
    //setInterval(updateRenderLoop, 50); //Useful to loop with a delay (use instead of request animation frame.
    
    if (shouldRotate) 
    {        
        scene.traverse(function (node) 
        {
            if (node instanceof THREE.Mesh) 
            {
                // insert your code here, for example:
                node.rotation.x += 0.025;
                node.rotation.y += 0.025;
            }
           
        });
    }
    raycaster.setFromCamera(mouse, camera);
}

function AddCrazyAmount(amountToAdd)
{
    var geometry = new THREE.OctahedronGeometry()
    var material = new THREE.MeshPhongMaterial({ color: 0x1355d5, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    
    //add in random pos
    for (var i = 0; i < amountToAdd; i++)
    {    
        //create random (based on screen size).
        var yrand = Math.floor((Math.random() * viewPortHeight))+ viewport.offsetTop;
        var xrand = Math.floor((Math.random() * viewPortWidth)) + viewport.offsetLeft;
        
        var possy = getXY(xrand, yrand);
      
        tetrahedron = new THREE.Mesh(geometry, material);
        tetrahedron.position.set(possy.x, possy.y, possy.z); 
        
        scene.add(tetrahedron);
    }
    
    startRotate();
}

function ClearAllFromScene()
{
    alert("Not implemented! press refresh");
}


function onMouseDown(event) 
{
    var pos = getXY(event.clientX, event.clientY);
    //var geometry = new THREE.OctahedronGeometry()
    //var material = new THREE.MeshPhongMaterial({ color: 0x1355d5, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    //tetrahedron = new THREE.Mesh(geometry, material);
    //tetrahedron.position.set(pos.x, pos.y, pos.z);
    //scene.add(tetrahedron);
    
    addTieFighter(pos)
}

function getXY(cX, cY) 
{
    var vector = new THREE.Vector3();

    vector.set(
        ((cX - viewport.offsetLeft) / viewport.offsetWidth) * 2 - 1,
        - ((cY - viewport.offsetTop) / viewport.offsetHeight) * 2 + 1,
        0);

    vector.unproject(camera);

    var dir = vector.sub(camera.position).normalize();
    var targetZ = 0;
    var distance = (targetZ - camera.position.z) / dir.z;

    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
}


function addObjectToScene(itemToAdd) 
{
    if (itemToAdd == 'Sphere') {
        addSphere();
    }
    else if (itemToAdd == 'Cube') {
        addBox();
    }
}


function addSphere() 
{
    var geometrySphere = new THREE.SphereGeometry(1, 20, 20);
    var materialSphere = new THREE.MeshLambertMaterial({ color: 0x1355d5 });
    Sphere = new THREE.Mesh(geometrySphere, materialSphere);
    scene.add(Sphere);
}


function addBox() 
{
    var geometry = new THREE.BoxGeometry(2, 2, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0x1355d5 });
    Cube = new THREE.Mesh(geometry, material);
    scene.add(Cube);
}


function onMouseMove(event) 
{
    mouse.x = (event.clientX)
    mouse.y = - (event.clientY)
    
    if (tracer) {
        var vector = new THREE.Vector3();

        vector.set(
            ((event.clientX - viewport.offsetLeft) / viewport.offsetWidth) * 2 - 1,
            - ((event.clientY - viewport.offsetTop) / viewport.offsetHeight) * 2 + 1,
            0);

        vector.unproject(camera);

        var dir = vector.sub(camera.position).normalize();

        var targetZ = 0;
        distance = (targetZ - camera.position.z) / dir.z;

        tracer.position.copy(camera.position).add(dir.multiplyScalar(distance));
    }
}


function onMouseUp()
{
    if (tracer) 
    {
        scene.add(tracer.clone());
        tracer = null;
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);
viewport.addEventListener('mousedown', onMouseDown, false);
render();
updateRenderLoop();