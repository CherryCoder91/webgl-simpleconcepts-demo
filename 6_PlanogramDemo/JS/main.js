//Demo Three.JS Planogram.
//Created By James Pickup 2015.

$(function () {

    //#region Global / Constructor scope

    //Important - keep theese global.
    var renderer, camera, scene;
    var knownSceneObjects = [];

    //Call start functions.
    Initialize();
    Animate();

    //#endregion

    //#region Methods

    //#region InitializeMethods

    function Initialize()
    {
        //Set constants
        this.James3DConst = InitConstantsObject();

        //We create basic blank scene with a perspective camera.
        scene = new THREE.Scene();

        //Initialize camera position and direction:
        InitCamera();

        //Initialise renderer values.
        InitRenderer(renderer);

        //Add any dev helpers we might like.
        //AddDevHelpers(true, true, scene);

        //Add basic spotlight
        AddAmbientLight(scene);

        //Generate a basic cube.
        AddDemoPlanogram();

        //Generate a collection containing traversed children.
        LoadSceneMeshObjectsIntoKnownCollection();

        //Given the plan no longer centers around (0,0) but rather on it, move the camera.
        MoveCameraCenterPlan();

        //Initialise raycasting of mouse and touch events.
        InitRaycasterFunctionality();

        // Add OrbitControls so that we can pan around with the mouse.
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        //We want the render to resize on window resize.
        AddOnWindowResizeEventHandler();

        //Supply the renderers target as our canvas
        $("#webGL-container").append(renderer.domElement);

        //SwitchCameraMode();
    }

    function InitCamera()
    {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 250;
        camera.lookAt(scene.position);
       
        scene.add(camera);
    }

    function InitRenderer()
    {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xdddddd);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.antialias = true;
    }

    function InitConstantsObject() {
        //Potentially could store this in a JSON file in future.
        myNewConstants =
        {
            colorRed: 0xff3300,
            colorWhite: 0xffffff,
            colorBlack: 0x000000,
            colorLime: 0x00FF66,
            colorPurple: 0x990099,
            colorBlue: 0x0066FF,
            colorOrange: 0xFF9900,
            colorPink: 0xFF66FF,
            colorGrey: 0x999999
        }
        return myNewConstants;
    }

    function InitRaycasterFunctionality()
    {
        //add raycaster and mouse as 2D vector
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        //add event listener for mouse and calls function when activated (and touch input).
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
    }

    //#endregion

    //#region Animation / Render

    function Animate()
    {
        //Request continued animation
        requestAnimationFrame(Animate);

        //Render the scene.
        renderer.render(scene, camera);
    }

    function AddOnWindowResizeEventHandler() {
        $(window).resize(function () {
            SCREEN_WIDTH = window.innerWidth;
            SCREEN_HEIGHT = window.innerHeight;

            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
            camera.updateProjectionMatrix();

            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        });
    }

    //#endregion

    //#region Development Helpers

    function AddDevHelpers(shouldAddAxis, shouldAddGrid, sceneToApplyTo) {
        //Add a helper for the axis <size>.
        if (shouldAddAxis) {
            var axis = new THREE.AxisHelper(30);
            sceneToApplyTo.add(axis);
        }

        //Add a grid helper to map base of scene <size, grid spacing>.
        if (shouldAddGrid) {
            var grid = new THREE.GridHelper(60, 5);
            gridColor = new THREE.Color(James3DConst.colorLime);
            grid.setColors(gridColor, James3DConst.colorBlack);
            sceneToApplyTo.add(grid);
        }
    } 

    //#endregion

    //#region DemoItemMethods

    function AddDemoPlanogram()
    {
        AddBase();
        AddBackboard();
        AddShelf();
        AddCubes();
    }

    function AddAmbientLight() {
        var light = new THREE.AmbientLight(James3DConst.colorWhite);
        scene.add(light);
    }

    function AddCubes() {
        
        var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorBlue });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 2.5;
        cube.position.y = 93.5;
        cube.position.z = 57.5;
        cube.castShadow = true;
        AddObjectToSceneWithEdge(cube);
        
        cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorPurple });
        var cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube2.position.x = 7.5;
        cube2.position.y = 93.5;
        cube2.position.z = 57.5;
        cube2.castShadow = true;
        AddObjectToSceneWithEdge(cube2)

        cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorLime });
        var cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube3.position.x = 12.5;
        cube3.position.y = 93.5;
        cube3.position.z = 57.5;
        cube3.castShadow = true;
        AddObjectToSceneWithEdge(cube3)
    }

    function AddPlane() {
        var planeGeometry = new THREE.PlaneGeometry(50, 50, 50);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorWhite });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.recieveShadow = true;

        //(Rotate the plane - Three.js seems to use Radians).
        plane.rotation.x = -0.5 * Math.PI;
        scene.add(plane);
    }

    function AddBase()
    {
        var cubeGeometry = new THREE.BoxGeometry(120, 3, 60);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorBlack });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 60;
        cube.position.y = 0.5;
        cube.position.z = 30;
        cube.castShadow = true;
        AddObjectToSceneWithEdge(cube);
    }

    function AddShelf() {
        var cubeGeometry = new THREE.BoxGeometry(120, 1, 60);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorBlack });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 60;
        cube.position.y = 90.5;
        cube.position.z = 30;
        cube.castShadow = true;
        AddObjectToSceneWithEdge(cube);
    }

    function AddBackboard()
    {
        var cubeGeometry = new THREE.BoxGeometry(120, 180, 1);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: James3DConst.colorGrey });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = 60;
        cube.position.y = 90;
        cube.position.z = -0.5;
        cube.castShadow = true;
        AddObjectToSceneWithEdge(cube);
    }

    //#endregion

    //#region HelperMethods

    function AddEdgeTo(objectToDrawEdgesAround, edgeColor) {
        var edges = new THREE.EdgesHelper(objectToDrawEdgesAround, edgeColor);
        scene.add(edges);
    }

    function AddObjectToSceneWithEdge(objectToAddToScene)
    {
        // Atm edge colour is fixed to black.
        AddEdgeTo(objectToAddToScene, James3DConst.colorBlack);
        scene.add(objectToAddToScene);
    }

    function LoadSceneMeshObjectsIntoKnownCollection()
    {
        //Traverse the scene and if object is a mesh add it to our array of known objects
        //Could posibily consider merging this to the AddObjectToSceneWithEdge method.
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                knownSceneObjects.push(child);
            }
        });
    }

    function ApplyNewSelection(meshToApplySelectionTo)
    {
        //Remove old selection
        scene.remove((scene.getObjectByName("selectedItemEdge")));

        //Add new selection
        var edge = new THREE.EdgesHelper(meshWeClickedOn, James3DConst.colorOrange)
        edge.name = "selectedItemEdge";
        scene.add(edge);
    }

    function MoveCameraCenterPlan()
    {
        //TODO:
        //Need to figure a way out how to center camera on all items.
    }

    function SwitchCameraMode()
    {
        if (camera instanceof THREE.PerspectiveCamera)
        {
            //Todo: need to correct ortho's frustrum to be dynamic.
            camera = new THREE.OrthographicCamera(window.innerWidth*4.5 / -16, window.innerWidth*4.5 / 16, window.innerHeight*4.5 / 16, window.innerHeight*4.5 / -16, -200, 500);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 100;
            camera.lookAt(scene.position);

        } else {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 100;
            camera.lookAt(scene.position);
        }
    };

    //#endregion

    //#region EventHandlers

    function onDocumentTouchStart(event)
    {
        event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown(event);
    }

    function onDocumentMouseDown(event)
    {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(knownSceneObjects);

        if (intersects.length > 0)
        {
            //We are a little stupid and asume that the first item [0] is what we want...
            meshWeClickedOn = intersects[0].object;
            ApplyNewSelection(meshWeClickedOn); 
        }
    }

    //#endregion

    //#endregion
});








