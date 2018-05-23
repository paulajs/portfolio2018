  //if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  (function () {
  var canvas, renderer, controls;
  var scenes = [];
  var textures = [
    new THREE.TextureLoader().load( "assets/display/strawberry.png" ),
    new THREE.TextureLoader().load( "assets/display/kvaede.png" ),
    new THREE.TextureLoader().load( "assets/display/hyld.png" )
  ];

  var colors = [
    0xDB5E83,
    0xEFD771,
    0xd2bde0
  ];

  var texturesFolder = [
    new THREE.TextureLoader().load( "assets/display/folder1.png" ),
    new THREE.TextureLoader().load( "assets/display/folder2.png" ),
    new THREE.TextureLoader().load( "assets/display/folder3.png" )
  ];

  init();
  animate();
  function init() {
    canvas = document.getElementById( "c" );
    var envMap = new THREE.CubeTextureLoader()
        .setPath( 'assets/display/' )
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

    var template = document.getElementById( "template" ).text;
    var content = document.getElementById( "content" );
    console.log('content',content);

    for ( let i =  0; i < 6; i ++ ) {
      var scene = new THREE.Scene();
      // make a list item
      var element = document.createElement( "div" );
      element.className = "list-item";
      if (i>2) {
        let wrap = { isOpened: false, mesh: null, mesh0: null, camera: null};
        element.className = "list-item folder";
        addLightFolder(scene);
        element.addEventListener('dblclick', function(e) {
          var sc = scenes[i].children;
          wrap.camera = scene.userData.camera;
          console.log(camera);
          wrap.mesh = sc.find( mesh => mesh.name === "folder");
          wrap.mesh0 = sc.find( mesh => mesh.name === "mesh");
          toggleBoklet(wrap);
        });
      }
      else{
        addLight(scene);
      }
      element.innerHTML = template.replace( '$', i + 1 );
      scene.userData.element = element.querySelector( ".scene" );

      content.appendChild( element );
      var camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 200 );
      camera.position.z = 55;
      scene.userData.camera = camera;

      controls = new THREE.OrbitControls( scene.userData.camera, scene.userData.element );
      controls.minDistance = 10;
      controls.maxDistance = 100;
      scene.userData.controls = controls;
      scenes.push( scene );

    }

      loader = new THREE.JSONLoader();
      loader.load('assets/display/jamLowP.json', function(geometry, material) {
        for (var i = 0; i < 3; i++) {
          var mat = material.map( material => material.clone());
          var mesh = new THREE.Mesh(geometry, mat);
          objectMaterialSettings(mesh, textures[i], envMap, colors[i]);
          mesh.name = "mesh";
          console.log(mesh);
          scenes[i].add(mesh);
        }
      });
      loader1 = new THREE.JSONLoader();
      loader1.load('assets/display/folder.json', function(geometry, material) {
        for (var i = 0; i < 3; i++) {
          var mat = material.map( material => material.clone());
          var mesh = new THREE.Mesh(geometry, mat);
          folderSettings(mesh, texturesFolder[i]);
          mesh.name = "folder";
          console.log(mesh.rotation);
          scenes[i+3].add(mesh);
        }
      });

      loader2 = new THREE.JSONLoader();
      loader2.load('assets/display/folder1.json', function(geometry, material) {
        for (var i = 0; i < 3; i++) {
          var mat = material.map( material => material.clone());
          var mesh = new THREE.Mesh(geometry, mat);
          folderSettings(mesh, texturesFolder[i]);
          scenes[i+3].add(mesh);
        }
      });
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha:true } );
    renderer.setClearColor( 0xff0000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
  }

  function toggleBoklet(folder){
    if(folder.isOpened){
      console.log(folder.isOpened);
      folder.isOpened = false;
      openBooklet((3*Math.PI)/4, folder.mesh)
    }
    else{
      console.log(folder.isOpened);
      folder.isOpened = true;
      openBooklet(-(3*Math.PI)/4, folder.mesh);


    }
  }

  function openBooklet(theta, mesh){
    var point = new THREE.Vector3(0,0,0);
    var axis = new THREE.Vector3(0,1,0);
    var pointIsWorld = false;
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
      mesh.parent.localToWorld(mesh.position); // compensate for world coordinate
    }
    mesh.position.sub(point); // remove the offset

    mesh.position.applyAxisAngle(axis, theta); // rotate the POSITION
    mesh.position.add(point); // re-add the offset

    if(pointIsWorld){
      mesh.parent.worldToLocal(mesh.position); // undo world coordinates compensation
    }
    mesh.rotateOnAxis(axis, theta); // rotate the OBJECT
  }
  function updateSize() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if ( canvas.width !== width || canvas.height != height ) {
      renderer.setSize( width, height, false );
    }
  }

  function folder1Settings(mesh, texture){
    mesh.material[1].map = texture;
    mesh.material[1].side = THREE.DoubleSide
    mesh.material[0].map = texture;
    mesh.material[0].side = THREE.DoubleSide
    mesh.doubleSided = true;
    mesh.scale.set(10, 10, 10);
    mesh.rotation.x = 0;
    mesh.position.x = 10;
  }

  function folderSettings(mesh, texture){
    mesh.material[1].map = texture;
    mesh.material[1].side = THREE.DoubleSide
    mesh.material[1].shininess = 60;
    mesh.material[0].map = texture;
    mesh.material[0].side = THREE.DoubleSide
    mesh.material[0].shininess = 60;
    mesh.rotation.y = 0;
    mesh.rotation.x = 0;
    mesh.rotation.z = 0;
    mesh.position.set( 0, 0, 0 );
    mesh.doubleSided = true;
    mesh.scale.set(10, 10, 10);
    mesh.position.x = 10;
  }

  function objectMaterialSettings(mesh, texture, envMap, color){
    mesh.scale.set(10, 10, 10);
    mesh.position.y = -10;
    mesh.rotation.y = 74.50;
    mesh.rotation.x = 0.2;
    mesh.material[0].transparent = true;  //glass
    mesh.material[0].refractionRatio = 0.5;
    mesh.material[0].shininess = 80;
    mesh.material[0].envMap = envMap;
    mesh.material[0].envMap.mapping = THREE.CubeRefractionMapping;
    mesh.material[0].color.setHex(0x464545);
    mesh.material[0].doubleSided = true;
    mesh.material[0].opacity = 0.6;

    mesh.material[1].doubleSided = true;// top
    mesh.material[1].color.setHex(0x1d1d1d);
    mesh.material[1].shininess = 70;
    mesh.material[1].metalness = 0.85;
    mesh.material[1].roughness = 0.22;

    mesh.material[3].map = texture; // label
    mesh.material[3].transparent = true;
    mesh.material[3].shininess = 20;
    mesh.material[3].color.setHex(color);
    mesh.material[3].roughness = 10;

    mesh.material[2].color.setHex(0x3c0e0e);// jam
    mesh.material[2].doubleSided = true;
  }

  function addLight(scene){
    var ambientLight = new THREE.AmbientLight(0xcccccc);
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 500, 500);
    directionalLight.intensity = 0.4;
    scene.add(directionalLight);

    var light = new THREE.SpotLight(0xffffff);
    light.position.set(800, 500, 50);
    light.intensity = 0.35;
    scene.add(light);

    var light2 = new THREE.SpotLight(0xffffff);
    light2.position.set(-500, -400, -250);
    light2.intensity = 0.35;
    light2.color.setHex(0xf5f5c2);
    scene.add(light2);

  }
  function addLightFolder(scene){

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    ambientLight.intensity = 0.4;
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-100, 600, -500);
    directionalLight.intensity = 0.2;
    scene.add(directionalLight);

    var light = new THREE.SpotLight(0xffffff);
    light.position.set(200, 500, 100);
    light.intensity = 0.5;
    scene.add(light);

    var light2 = new THREE.SpotLight(0xffffff);
    light2.position.set(-100, -400, -100);
    light2.intensity = 0.4;
    light2.color.setHex(0xf5f5c2);
    scene.add(light2);

  }

  function animate() {
    render();
    requestAnimationFrame( animate );
  }
  function render() {
    updateSize();
    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setClearColor( 0x333333,0 );
    renderer.setScissorTest( true );
    scenes.forEach( function( scene ) {

      var element = scene.userData.element;
      // get its position relative to the page's viewport
      var rect = element.getBoundingClientRect();
      // check if it's offscreen. If so skip it
      if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
         rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
        return;  // it's off screen
      }
      // set the viewport
      var width  = (rect.right - rect.left);
      var height = (rect.bottom - rect.top);
      var left   = rect.left;
      var top    = rect.top;
      renderer.setViewport( left, top, width, height );
      renderer.setScissor( left, top, width, height );
      var camera = scene.userData.camera;

      renderer.render( scene, camera );
    } );
  }
}());
