var camera, scene, renderer, controls;
var clock = new THREE.Clock();
var isAnimating = false;
var clickTime = Date.now();
var newClick = clickTime + 1600;
var gameEnd = false;

var movementSpeed = 80;
var totalObjects = 1000;
var objectSize = 250;// 150 mobile
var sizeRandomness = 4000;
var dirs = [];
var parts = [];

var colorArray = [
  0xFF00FF,
  0xFF1AFF,
  0xFF33FF,
  0xFF4DFF,
  0xFF66FF,
  0xFF7FFF,
  0x14F459,
  0x2EFF73,
  0x47FF8C,
  0x61FFA6,
  0x7AFFBF,
  0x93FFD8,
  0xCC00CC,
  0xB300B3
];

console.log("window.innerWidth", window.innerWidth)

var interval2 = setInterval(function() {
  if(isready == true) {
    console.log(isready);
    clearInterval(interval2);
    if(window.innerWidth >= 736){
      initiateCanvasDesktop();
    }
    else{
      initiateCanvasMobile();
    }
  }
     
}, 100);



function init(distance, numBallsX, numBallsY, xMin, yMin, radius, controlsOn){
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.0026 );

  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0x000000, 0 );
  var canvascon = document.querySelector('#bubbles-container');
  canvascon.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60,(window.innerWidth)/(window.innerHeight), 1, 10000);
  camera.position.set(0, 0, 390); //450
  scene.add(camera);

  var light = new THREE.SpotLight(0xffffff);
  light.position.set(50, 200, 200);
  scene.add(light);

  var light2 = new THREE.SpotLight(0xFF00FF);
  light2.position.set(20, 500, -600); //50
  scene.add(light2);

  var light3 = new THREE.SpotLight(0x14F459);
  light3.position.set(300, 300, 50); //-600
  scene.add(light3);

  if(controlsOn === true){
      controls = new THREE.OrbitControls( camera, renderer.domElement );
      controls.addEventListener( 'change', render );
  }

  var xMax = xMin + numBallsX*distance;
  var yMax = yMin + numBallsY*distance;
  var count = 0;
  for (var i = xMin; i <= xMax; i+= distance) {
    for(var j = yMin; j <= yMax; j+= distance){
      var objName = String(i)+String(j);
      makeAddSphere(0xffffff, i, j, 0, radius, objName, count);
      count = count+1;
    }
  }
}

function initiateCanvasDesktop(){
  init(56, 9, 3, -240, -110, 18, true); /*9, 3*/
  //distance, numBallsX, numBallsY, xMin, yMin, radius, controlsOn
  animate();
  var canvas = document.querySelector('#bubbles-container');
  console.log(document.querySelector('#bubbles-container'));
  canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
  canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
  function animate(){
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    controls.update( delta );
    render();
  }
}

function initiateCanvasMobile(){
  init(65, 3, 3, -95, -135, 20, false);//90
  //distance, numBallsX, numBallsY, xMin, yMin, radius, controlsOn
  animate();
  function animate(){
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    render();
  }

  document.addEventListener( 'mousedown', onDocumentMouseDownMobile, false );
}

function onDocumentMouseDownMobile( e ) {

  var elem = document.querySelector(".pointsDisplay");
  elem.style.animation = "none";
  if(isAnimating == false){
    var intersects = getIntersects(e);
    if(intersects.length > 0) {

      var array = getIntersectingBalls(intersects[ 0 ].object);
      congratulate(1);
      if(intersects[ 0 ].object.material.color.getHex() == 0xffffff){
        touchMobileSetColor(intersects[ 0 ].object.material);
        var num = 1.5*Math.random()+0.7;
        scaleAnimation( intersects[ 0 ].object, num, 2500);
      }
      else{
        if(Date.now()<newClick){return}
        clickTime = Date.now();
        newClick = clickTime + 900;
        console.log(clickTime);
        scaleAnimation( intersects[ 0 ].object, 5, 2500);
        setTimeout(function(){
          isAnimating = false;
          scene.remove(intersects[ 0 ].object);
          bubblePopMobile(elem, array, e, intersects);
        }, 700);
      }
    }
  }
}

function onDocumentMouseDown( e ) {
  isAnimating = true;
  if(Date.now()<newClick){return}
  if (gameEnd == true) {
    gameEnd = false;
    window.location.reload();
  }
  clickTime = Date.now();
  newClick = clickTime + 1600;
  console.log(clickTime);
  var sounds = document.querySelector('#bubbleSounds');
  sounds.src = "assets/"+"pop6"+".mp3";
  
  var elem = document.querySelector(".pointsDisplay");
  elem.style.animation = "none";
  var intersects = getIntersects(e);
  if (intersects.length>0){
    var array = getIntersectingBalls(intersects[ 0 ].object);
    scaleAnimation( intersects[ 0 ].object, 10, 700);
    sounds.play();
    setTimeout(function(){
      isAnimating = false;
      scene.remove(intersects[ 0 ].object);
      bubblePopDesktop(elem, array, e, intersects);
    }, 700);
  }
  else{
    isAnimating = false;
  }
}

  function onDocumentMouseMove(event) {
    if(isAnimating == false){
      var intersects = getIntersects(event);
      if(intersects.length > 0) {
        mouseMoveSetColor(intersects[ 0 ].object.material);
          document.body.style.cursor = "pointer";
          var num = 2.2*Math.random()+0.5;
          scaleAnimation( intersects[ 0 ].object, num, 2500);
      } else {
          document.body.style.cursor = "default";
      }
    }
}

function makeAddSphere(color, posX, posY, posZ, radius, name, delay){
  var geometry = new THREE.SphereGeometry(radius, 16, 16);
  var material = new THREE.MeshPhongMaterial({
    color:color,
    transparent: true,
    opacity: 0.3,
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.name = name;
  mesh.scale.set(0.1, 0.1 , 0.1)
  mesh.geometry.computeBoundingBox();
  new TWEEN.Tween( mesh.scale ).to( {
    x:1,
    y:1,
    z:1 }, 800 ).delay(30*delay)
  .easing( TWEEN.Easing.Elastic.Out).start();
  scene.add(mesh);
}

function getIntersectingBalls(intersectedObject){
  var id = intersectedObject.name;
  var ball1BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  ball1BBox.setFromObject(intersectedObject);
  var intersectArray = [];
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i].type == "Mesh" && id != scene.children[i].name ) {
      var ball = scene.children[i];
      var ball2BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      ball2BBox.setFromObject(ball);
      if (ball1BBox.intersectsBox(ball2BBox)) {
        intersectArray.push(ball.name);
      }
    }
  }
  return intersectArray;
}

function getIntersects(event){
  var mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / (window.innerWidth) ) * 2 - 1;
  mouse.y = - ( event.clientY / (window.innerHeight) ) * 2 + 1;
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  return intersects;
}

function mouseMoveSetColor(objectMaterial){
  var randomColorIndex = Math.floor(Math.random()*colorArray.length);
  var colorMaterial = colorArray[randomColorIndex];
  if(objectMaterial.color.getHex() == 0xffffff){
    objectMaterial.color.setHex( colorMaterial);
    objectMaterial.opacity = 1;
  }
}
function scaleAnimation(object, factor, time){
  new TWEEN.Tween( object.scale ).to( {
    x:factor,
    y:factor,
    z:factor }, time )
  .easing( TWEEN.Easing.Elastic.Out).start();
}

function bubblePopMobile(elem, array, e, intersects){
  displayPoints(elem, array, e, "30%", e.clientY + "px");
  removeBallsMobile(array);
  addFireworks(intersects, 80, 100 + 200*array.length);
}

function bubblePopDesktop(elem, array, e, intersects){
  displayPoints(elem, array, e, e.clientX + "px", e.clientY + "px");
  removeBallsDesktop(array);
  addFireworks(intersects, 150, 100 + 300*array.length);
}

function touchMobileSetColor(objectMaterial){
  var objectColor = colorArray[Math.floor(Math.random()*colorArray.length)];
  objectMaterial.color.setHex(objectColor);
  objectMaterial.opacity = 1;
}

function displayPoints(elem, array, e, posX, posY){
  var points =(array.length+1)*1000;
  var backgrounds = ['../assets/points-background1.png','../assets/points-background2.png'];
  var randomNum = Math.floor(Math.random()*2);
  var str = "+"+String(points);
  elem.innerHTML = str;
  elem.style.left = posX;
  elem.style.top = posY;
  elem.style.background = "url('"+backgrounds[randomNum]+"') no-repeat top left" ;
  elem.style.animation = "pointsAnim 1.25s ease-in";
}
function removeBallsMobile(array){
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < scene.children.length; j++) {
      if (array[i] == scene.children[j].name) {
        scene.remove(scene.children[j]);
        congratulate(0);
      }
    }
  }
}
//intersectedBalls
function removeBallsDesktop(array){
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < scene.children.length; j++) {
      if (array[i] == scene.children[j].name) {
        scene.remove(scene.children[j]);
      }
    }
  }
  congratulate(0);
}

function congratulate(minBall){
  if(countBalls() === minBall){
    congrats();
    gameEnd = true;
  }
}

function countBalls(){
  var count = 0;
  for (var i = 0; i < scene.children.length; i++) {
    if(scene.children[i].type === "Mesh"){
      count += 1;
    }
  }
  return count;
}

function congrats(){
  var backWin = document.querySelector('#full-screen-win');
  var sti = "assets/applause.mp4";
  var stiMob = "assets/applausemob.mp4";
  var sounds = document.querySelector('#bubbleSounds');
  
  setTimeout(function(){
    if(window.innerWidth < 736){
      backWin.src = stiMob;
      backWin.play();
    }
    else{
      backWin.src = sti;
    } 
    sounds.src = "assets/"+"applause"+".wav";
    sounds.play();
  }, 500);
}

function addFireworks(intersects, objectSize, totalObjects){
  const expPosX = intersects[ 0 ].object.position.x;
  const expPosY = intersects[ 0 ].object.position.y;
  const expColor = intersects[ 0 ].object.material.color.getHex();
  parts.push(new ExplodeAnimation(expPosX, expPosY, expColor, objectSize, totalObjects));
}

function ExplodeAnimation(x,y, color, objectSize, totalObjects){
  var geometry = new THREE.Geometry();

  for (i = 0; i < totalObjects; i ++){
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;

    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var sprite = new THREE.TextureLoader().load( "assets/disk.png" );
  var material = new THREE.PointsMaterial( { size: objectSize, map: sprite,  color: color, alphaTest: 0.7, transparent: true });
  var particles = new THREE.Points( geometry, material );

  this.object = particles;
  this.status = true;

  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);

  scene.add( this.object  );

  this.update = function(){
    if (this.status == true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount];
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
        if (particle.z>20000) {
          scene.remove(this.object);
        }
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
}

function render(){
  TWEEN.update();
  var pCount = parts.length;
  while(pCount--) {
    parts[pCount].update();
  }
  renderer.render(scene, camera);
}
