
function startDisplayJam(container){
  var sceneJam, cameraJam, rendererJam, controlsJam;
  initJamDisplay(container);
  animateJamDisplay();
}



    function initJamDisplay(container){
      sceneJam = new THREE.Scene();
      //scene.background = new THREE.Color(0x8c8fbb);
      var envMap = new THREE.CubeTextureLoader()
					.setPath( 'assets/display/' )
					.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

      sceneJam.fog = new THREE.Fog(0x8c8fbb, 50, 1000);

      cameraJam = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 2000);
      cameraJam.position.z = 400;

      rendererJam = new THREE.WebGLRenderer({antialias: true, alpha:true});

      rendererJam.setSize(window.innerWidth*0.7,window.innerHeight*0.7);
      rendererJam.domElement.className = "productThree";
      rendererJam.setClearColor( 0x000000, 0 );
      container.appendChild(rendererJam.domElement);
      var ambientLight = new THREE.AmbientLight(0xcccccc);
      ambientLight.intensity = 0.4;
      sceneJam.add(ambientLight);

      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 500, -500);
      directionalLight.intensity = 0.2;
      sceneJam.add(directionalLight);

      var light = new THREE.SpotLight(0xffffff);
      light.position.set(200, 500, 100);
      light.intensity = 0.8;
      sceneJam.add(light);

      var light2 = new THREE.SpotLight(0xffffff);
      light2.position.set(-200, -400, -100);
      light2.intensity = 0.4;
      sceneJam.add(light2);

      var light3 = new THREE.SpotLight(0xffffff);
      light3.position.set(0, 100, 0);
      light3.intensity = 0.4;
      sceneJam.add(light3);

      controlsJam = new THREE.OrbitControls( cameraJam, rendererJam.domElement );

      var texture = new THREE.TextureLoader().load( "assets/display/strawberry.png" );
      var texture2 = new THREE.TextureLoader().load( "assets/display/kvaede.png" );

      //var map = new THREE.TextureLoader().load( "chess.jpg" );

      var loader = new THREE.JSONLoader();
      loader.load('assets/display/jamLowP.json', function(geometry, material) {
        mesh2 = new THREE.Mesh(geometry, material);
        mesh2.scale.set(50, 50, 50);
        mesh2.position.y = -50;
        mesh2.rotation.y = 74.9;
        mesh2.rotation.x = 0.2;
        console.log(mesh2.material);
        mesh2.material[3].map = texture;
        mesh2.material[3].transparent = true;
        mesh2.material[3].shininess = 90;
        mesh2.material[0].transparent = true;
        mesh2.material[0].refractionRatio = 0.45;
        mesh2.material[0].shininess = 20;
        mesh2.material[0].envMap = envMap;
        mesh2.material[0].envMap.mapping = THREE.CubeRefractionMapping;

        mesh2.material[2].doubleSided = true;
        mesh2.material[2].color.setHex(0x410415);
      
        mesh2.material[1].color.setHex(0x241e1f);
        mesh2.material[3].color.setHex(0xDB5E83);
        mesh2.material[3].roughness = 0.3;
        mesh2.material[0].color.setHex(0x464545);
        mesh2.material[0].doubleSided = true;
        mesh2.material[0].opacity = 0.6;

        sceneJam.add(mesh2);

      });

    }
    function animateJamDisplay(){
      requestAnimationFrame(animateJamDisplay);
      renderJamDisplay();
    }
    function renderJamDisplay(){
      controlsJam.update();
      rendererJam.render(sceneJam, cameraJam);
    }
