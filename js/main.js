class ShapeOverlays {
  constructor(elm, numPoints, duration, delayPointsMax, delayPerPath) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = numPoints;
    this.duration = duration;
    this.delayPointsArray = [];
    this.delayPointsMax = delayPointsMax;
    this.delayPerPath = delayPerPath;
    this.timeStart = Date.now();
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    const range = 4 * Math.random() + 6;
    for (var i = 0; i < this.numPoints; i++) {
      const radian = i / (this.numPoints - 1) * Math.PI;
      this.delayPointsArray[i] = (Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4 * this.delayPointsMax;
    }
    this.timeStart = Date.now();
    this.renderLoop();
  }

  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints + 1; i++) {
      var timeExp = Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1);
      points[i] = ease.exponentialIn(timeExp) * 100
    }
    let str = '';
    str += `M 0 0 V ${points[0]} `;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str +=  `V 0 H 0`;
    return str;
  }
  render() {
      for (var i = 0; i < this.path.length; i++) {
        var computedPath = this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i));
        this.path[i].setAttribute('d', computedPath);
      }
  }
  renderLoop() {
    var shapeOverlays = document.querySelector('.shape-overlays');
    shapeOverlays.style.display = "block";
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
      var vid = document.querySelector('.wrapper video');
      vid.src = "";
      shapeOverlays.style.display = "none";
      var canvas = document.querySelector('#bubbles-container');
      canvas.style.zIndex = "0";
    }
  }
}

(function() {
  const button = document.querySelectorAll('.case');
  const cross = document.querySelector('.cross');
  const hamburger = document.querySelector('.hamburger');
  const gNavItems = document.querySelectorAll('.global-menu__item');
  const elmOverlay = document.querySelector('.shape-overlays');
  const pageClose = document.querySelectorAll('.pageClose');
  const video = document.querySelectorAll('.video');
  const imgToDisplay = document.querySelectorAll('.interactive');
  const displayImgContainer = document.querySelector('.imgDisplay');
  const threeElement = document.querySelectorAll('.clickMe');
  var overlay=0;
  var pageActive = false;
  var linkId = "";

  const header = document.querySelector('.about .header');
  const cta = document.querySelector('.about .ctabutton');
  const footer = document.querySelector('.contact-info');
  const textsec = document.querySelector('.about-text-section');
  const text = document.querySelectorAll('.about-text-section p');

  const backgroundContainer = document.querySelector('#about-background');
  const backgroundContainerImage = backgroundContainer.querySelector("img");
  const backgroundContainerVideo = backgroundContainer.querySelector("video");
  var lastViewedMarkWasMovie = false;
  var playVideoPromise = null;
  var isPlayingVideo = false;

  var emailCopyButton = document.querySelector('.email-copy');

  emailCopyButton.addEventListener('click', onEmailCopyClickHandler);

  function onEmailCopyClickHandler(){
    var emailadress = document.querySelector('.email');

    var range = document.createRange();  
    range.selectNode(emailadress);  
    window.getSelection().addRange(range);

    try {  
      // Now that we've selected the anchor text, execute the copy command  
      var successful = document.execCommand('copy');  
      var msg = successful ? 'successful' : 'unsuccessful';  
      console.log('Copy email command was ' + msg);  
    } catch(err) {  
      console.log('Oops, unable to copy');  
    }
    window.getSelection().removeAllRanges();   
  }

  //about functions
  var allMarks = document.querySelectorAll('.about-text-section p mark');
  for (let i = 0; i < allMarks.length; i++) {
      allMarks[i].addEventListener('mouseover', onMarkMouseOver);  
      allMarks[i].addEventListener('mouseout', onMarkMouseOut);
  }

  function hideTextAndShowResource() {
    header.style.background = "none";
    footer.style.background = "none";
    cta.style.background = "none";
    textsec.style.background = "none";
    text[0].style.color = "transparent";
    text[1].style.color = "transparent";
    text[2].style.color = "transparent";
  }

  function showTextAndNormalizeResource() {
    backgroundContainerImage.src = ""
    header.style.background = "white";
    cta.style.background = "white";
    footer.style.background = "white";
    textsec.style.background = "white";
    text[0].style.color = "black";
    text[1].style.color = "black";
    text[2].style.color = "black";
  }

  function onMarkMouseOver(e){
    const resourceTarget = e.target.dataset.resource;
    const isMovie = resourceTarget.split(".").pop() === "mp4";

    if(isMovie) {
      lastViewedMarkWasMovie = true;
      backgroundContainerVideo.src = resourceTarget;
      if(isPlayingVideo) {
        return;
      }
      playVideoPromise = backgroundContainerVideo.play();
      playVideoPromise.then( () => {
        isPlayingVideo = true;
      });
    } else {
      backgroundContainerImage.src = resourceTarget;
    }
    hideTextAndShowResource();
  }

  function onMarkMouseOut(e){
    if(lastViewedMarkWasMovie) {
      lastViewedMarkWasMovie = false;
      playVideoPromise.then( () => {
        backgroundContainerVideo.pause();
        isPlayingVideo = false;
        backgroundContainerVideo.src = "";
      });
    }
    showTextAndNormalizeResource();
  }
  //

  if(window.innerWidth >= 736){
    overlay = new ShapeOverlays(elmOverlay, 14,800, 520, 110);
  }
  else{
    overlay = new ShapeOverlays(elmOverlay, 10, 600, 340, 130);
  }
  for (var i = 0; i < pageClose.length; i++) {
    pageClose[i].addEventListener('click', pageCloseHandler);
  }

  var opacityBackground = document.querySelector('.displayImgBackgroundOpacity');
  opacityBackground.addEventListener('click', (e) => {
    e.target.style.display = "none";
    displayImgContainer.style.display = "none";
    var imgWrap = document.querySelector('.imgDisplayWrap');
    var threeCanvas = document.querySelector('.productThree');
    imgWrap.removeChild(threeCanvas);
  });

  for (var i = 0; i < imgToDisplay.length; i++) {
    imgToDisplay[i].addEventListener('click', (e) =>{
      var parent = e.target.parentNode;
      // try higher if not found
      if(!parent.querySelector('img')) {
        var parent = e.target.parentNode.parentNode;
      }
      if(!parent.querySelector('img')) {
        throw new Error('Could not find img in parent node or parents node parent node.');
      }
      let source = parent.querySelector('img').src;
      let displayImgContainer = document.querySelector('.imgDisplay');
      let opacityBackground = document.querySelector('.displayImgBackgroundOpacity');
      displayImgContainer.style.display = "block";
      displayImgContainer.src = source;
      opacityBackground.style.display = "block";
    });
  }
  var threeWrap = document.querySelector('.imgDisplayWrap');
  var firstFolderLoad = true;
  for (var i = 0; i < threeElement.length; i++) {
    threeElement[i].addEventListener('click', (e) => {
      var target = e.target;
      var dataType = target.dataset.type;
      // if no dataset.type try the parent
      if(!dataType) {
        target = e.target.parentNode
        dataType = target.dataset.type;
      }
      if(!dataType) {
        throw new Error('Could not find data-type');
      }
      if (target.dataset.type == "folder") {
        var srcStr = "assets/display/"+target.dataset.source+".png";
        startDisplayFolder(threeWrap, srcStr, firstFolderLoad);
        firstFolderLoad = false;
      }
      else{
        let source =  target.dataset.source
        console.log('jam src: ',source);
        var srcStr = "assets/display/" + source + ".png";
        
        startDisplayJam(threeWrap, srcStr);
      }
      //threeWrap.appendChild(canvasElement);
      var opacityBackground = document.querySelector('.displayImgBackgroundOpacity');
      opacityBackground.style.display = "block";
    });
  }


  displayImgContainer.addEventListener('click', (e) => {
    e.target.src = "";
    e.target.style.display = "none";
    var opacityBackground = document.querySelector('.displayImgBackgroundOpacity');
    displayImgContainer.style.display = "none";
    opacityBackground.style.display = "none";
    console.log('img clicked');
  });


function pageCloseHandler(){
  pageActive = false;
  var animBack = document.querySelector('#animation-case-backg');
  animBack.style.display = "none";
  document.querySelector('.wrapper').style.overflow = "hidden";
  document.querySelector('.wrapper').style.border = "none";
  var page = document.querySelectorAll('.page');
  var canvas = document.querySelector('#bubbles-container');
  canvas.style.visibility = "visible";
  var item5 = document.querySelector('.item-5');
  item5.style.zIndex = -1000;
  var caseLink = document.querySelectorAll('.case');
  for (var i = 0; i < caseLink.length; i++) {
    caseLink[i].classList.remove("activeLink");
  }
  for (var i = 0; i < page.length; i++) {
    page[i].style.display = "none";
  }
}
  cross.addEventListener('click', () => {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    var mobileMenu = document.querySelector('.mobile-menu');
    setTimeout(function(){
      mobileMenu.style.display = "none";
      hamburger.style.display = "block";
      console.log('hello');
    }, 800);
  });

  for (var i = 0; i < video.length; i++) {
    video[i].addEventListener('click', (e) => {
      e.target.volume = 0.05;
      console.log('vid controls', e.target.controls);
      var parent = e.target.parentNode;
      var playButton = parent.querySelector('.play-button');
      var pauseButton = parent.querySelector('.pause-button');
      if (e.target.paused) {
        playButton.style.display = "block";
        e.target.play();
        setTimeout(function(){
          playButton.style.display = "none";
        }, 450);
      }
      else{
        pauseButton.style.display = "block";
        e.target.pause();
        setTimeout(function(){
          pauseButton.style.display = "none";
        }, 450);
      }
    });
    video[i].addEventListener('mouseover', (e) => {
      e.target.setAttribute('controls', true);
    });
    video[i].addEventListener('mouseout', (e) => {
      e.target.removeAttribute('controls', true);
      console.log(e.target.attributes);
    });

  }

  hamburger.addEventListener('click', (e) => {
    if (overlay.isAnimating) {
      return false;
    }
    var mobileMenu = document.querySelector('.mobile-menu');
    overlay.toggle();
    setTimeout(function(){
      mobileMenu.style.display = "grid";
      hamburger.style.display = "none";
    }, 950);

  });

  for (var i = 0; i < button.length; i++) {
      var background = document.querySelector('#noise');
      button[i].addEventListener('click', linkClickHandler);
      button[i].addEventListener('mouseenter', linkMouseEnterHandler);
      button[i].addEventListener('mouseleave',linkMouseLeaveHandler);
    }

      function linkClickHandler(e){
        var caseLink = document.querySelectorAll('.case');
        for (var i = 0; i < caseLink.length; i++) {
          caseLink[i].classList.remove("activeLink");
          //page[i].style.animation = "none";
        }
        pageActive = true;
        console.log('prev link',linkId);
        if (linkId) {
          var elemClass = String("."+linkId);
          var pageAnimOut = document.querySelector(elemClass);
          console.log(pageAnimOut);
        }

        linkId = setId(e);

        if (overlay.isAnimating) {
          return false;
        }
        if (e.target.nodeName == "P"){
          var link = e.srcElement.parentNode;
        }
        else{
          var link = e.target;
        }
        link.classList.add("activeLink");
        overlay.toggle();
        var vid = document.querySelector('.wrapper video');
        vid.pause();
        displayPageById(linkId);

        setTimeout(function() {
            vid.style.display = "none";
            var item5 = document.querySelector('.item-5');
            item5.style.zIndex = 1000;
            var canvas = document.querySelector('#bubbles-container');
            canvas.style.visibility = "hidden";
        }, 1100);
      }

      function linkMouseLeaveHandler(e){
        if (overlay.isAnimating ==false && pageActive == false) {
          removeVideo(pageActive);
          var item5 = document.querySelector('.item-5');
          item5.style.zIndex = -100;
        }
      }
      function linkMouseEnterHandler(e){
        if (overlay.isAnimating ==false && pageActive == false) {
          pageActive = false;
        background.style.display = "block";
        background.play();
        background.style.zIndex = -3;
        var bodyBackground = document.querySelector('body');
        if (bodyBackground.style.background != "#FFF") {    
          bodyBackground.style.background = "#FFF";
        }
        setVideo(e);
        var caseLink = document.querySelectorAll('.case');
        for (var i = 0; i < caseLink.length; i++) {
          caseLink[i].classList.remove("activeLink");
        }

        setTimeout(function() {
            background.style.display = "none";
        }, 400);
      }
      }

      function setId(e){
        var linkId;
        if (e.target.nodeName == "P"){
          linkId = e.srcElement.parentNode.id;
        }
        else{
          linkId = e.target.id;
        }
        return linkId;
      }

      function displayPageById(linkId, pageActive){
        pageActive = true;
        var sound = document.querySelector('#theSound');
        var audio = "assets/" + "trans2" + ".mp3";
        sound.src= audio;
        sound.play();
        sound.loop = false;
        var backgr = document.querySelector('#animation-case-backg');
          backgr.style.display = "block";
        setTimeout(() => {
          var page = document.querySelectorAll('.page');
          for (var i = 0; i < page.length; i++) {
            page[i].style.display = "none";
          }
          var wrapper = document.querySelector('.wrapper');
          wrapper.style.overflowY = "scroll";
          wrapper.scrollTop = 0;
          var pageClass = "."+linkId;
          console.log('new link',linkId);
          
          var page1 = document.querySelector(pageClass);
          page1.style.display = "grid";
          page1.scrollTop = 0;
          console.log('scroll top',wrapper.scrollTop);
          //sound.pause();
          //sound.src= "";
        }, 2700);
      }

      function setVideo(e){
        document.querySelector('#bubbles-container').style.visibility = "hidden";
        var vid = document.querySelector('.wrapper video');
        var sound = document.querySelector('#theSound');
        vid.style.display = "block";
        var target = e.target;
        console.log(target.id);
        var url = "assets/" + target.id + ".mp4";
        var audio = "assets/" + target.id + ".mp3";
        vid.src = url;
        sound.src = audio;
        sound.loop = "true";
        sound.play();
        vid.loop = "true";
        vid.play().catch(() => {
          // throw away pause errors!
        });

      }

      function removeVideo(pageActive){
        if (!pageActive) {
          var canvas = document.querySelector('#bubbles-container');
          canvas.style.visibility = "visible";
        }
        var vid = document.querySelector('.wrapper video');
        var sound = document.querySelector('#theSound');
        sound.pause();
        sound.src="";
        vid.pause();
        vid.src = "";
        document.querySelector('.wrapper').style.background ="transparent";
      }

}());
