

function startDisplayFolder(container, imgSrc){
  var sceneFolder, cameraFolder, rendererFolder, controlsFolder;
  var open = false;
  initFolderDisplay(container, imgSrc);
  animateFolderDisplay();
}

      //initFolderDisplay(container);
      //animateFolderDisplay();

      function initFolderDisplay(container, imgSrc){
        sceneFolder = new THREE.Scene();
        sceneFolder.fog = new THREE.Fog(0x1f4779,10,350);
        rendererFolder = new THREE.WebGLRenderer({alpha: true});
        rendererFolder.setPixelRatio( window.devicePixelRatio );
        rendererFolder.setSize(window.innerWidth*0.7,window.innerHeight*0.7);
        rendererFolder.domElement.className = "productThree";
        rendererFolder.setClearColor( 0xff0000, 0 );
        //var container = document.querySelector('.container');
        container.appendChild(rendererFolder.domElement);

        cameraFolder = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight, 1, 1000);
        cameraFolder.position.z = 50;
        sceneFolder.add(cameraFolder);

        controlsFolder = new THREE.OrbitControls( cameraFolder, rendererFolder.domElement );

        //controls.autoRotate = true;
        addLight(sceneFolder);

        var loader = new THREE.JSONLoader();

				loader.load('assets/display/folder.json', function(geometry, material) {
          var texture = new THREE.TextureLoader().load( imgSrc );
					var mesh = new THREE.Mesh(geometry, material);
          mesh.material[1].map = texture;
          mesh.material[1].side = THREE.DoubleSide
          mesh.material[0].map = texture;
          mesh.material[0].side = THREE.DoubleSide
          mesh.rotation.y = 0;
          mesh.rotation.x = 0;
          mesh.rotation.z = 0;
          mesh.position.set( 0, 0, 0 );
          mesh.name = "folder";
          mesh.doubleSided = true;
          mesh.scale.set(10, 10, 10);
					sceneFolder.add(mesh);
				});

        var loader2 = new THREE.JSONLoader();

				loader2.load('assets/display/folder1.json', function(geometry, material) {
          var texture = new THREE.TextureLoader().load( imgSrc );
					var mesh = new THREE.Mesh(geometry, material);
          mesh.material[1].map = texture;
          mesh.material[1].side = THREE.DoubleSide
          mesh.material[0].map = texture;
          mesh.material[0].side = THREE.DoubleSide
          mesh.doubleSided = true;
          mesh.scale.set(10, 10, 10);
          mesh.rotation.x = 0;
          openBooklet(0, mesh);
					sceneFolder.add(mesh);
				});

        container.addEventListener('click', (event) => {
          var mouse = new THREE.Vector2();
          mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

          var raycasterFolder = new THREE.Raycaster();
          raycasterFolder.setFromCamera( mouse, cameraFolder );
          var intersects = raycasterFolder.intersectObjects( sceneFolder.children );
          if(intersects.length > 0) {
            var object = sceneFolder.getObjectByName( "folder" );
            openBooklet(-Math.PI/2, object);
            toggleBoklet();
          }
        });
      }

      function toggleBoklet(){
          for (var i = 0; i < sceneFolder.children.length; i++) {
            if (sceneFolder.children[i].name == "folder") {
              if(open){
                openBooklet(-Math.sin(Math.PI/4), sceneFolder.children[i])
                open = false;
              }
              else{
                openBooklet(Math.sin(Math.PI/4), sceneFolder.children[i]);
                open = true;
              }
            }
          }
      }

      function openBooklet(theta, mesh){
        if (mesh.rotation.y > 1) {
          theta = theta*3;
        }
        var point = new THREE.Vector3(-10,0,0);
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

      function addLight(sceneFolder){
        var ambientLight = new THREE.AmbientLight(0xcccccc);
        ambientLight.intensity = 0.4;
        sceneFolder.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, 500, -500);
        directionalLight.intensity = 0.2;
        sceneFolder.add(directionalLight);

        var light = new THREE.SpotLight(0xffffff);
        light.position.set(200, 500, 100);
        light.intensity = 0.5;
        sceneFolder.add(light);

        var light2 = new THREE.SpotLight(0xffffff);
        light2.position.set(-100, -400, -100);
        light2.intensity = 0.4;
        light2.color.setHex(0xf5f5c2);
        sceneFolder.add(light2);

      }

      function animateFolderDisplay(){
        requestAnimationFrame(animateFolderDisplay);
        renderFolderDisplay();
      }

      function renderFolderDisplay(){
        controlsFolder.update();
          TWEEN.update();
        rendererFolder.render(sceneFolder, cameraFolder);
      }
