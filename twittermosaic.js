
var imap_="images/imap.png";
var workrjs='mosaicr.js';

var iW,iH,ctx,uimg,I,image,fdata;
var canoffset=5;
var mTW=300;
var mTH=300;
var processThumbW=110;
var processThumbH=110;
var stageRect=new Object();
stageRect.x=5;
stageRect.y=5;
stageRect.width=200;
stageRect.height=250;
var imgBorder=10;

var althtml='<div id="warn"><h2>You\'ll need a modern browser to view this demo.</h2><p>Your browser does not have some of the features required to run this demo.Try upgrading your browser.</p></div>';


function init(){

  if(hascanvas()){

    if(hascanvastext() && window.Worker && window.File && window.FileReader && window.localStorage){
      $('#tz')[0].focus();
      $('#tz')[0].disabled=false;

      ctx=$('#stage')[0].getContext('2d');
      ctx.textBaseline="top";

      uimg=new Image();
      uimg.onload=function(){
        drawPad();
      }
      uimg.src=imap_;
    }else{
      byeber();
    }
  }else{
    byeber();

  }
}

function byeber(){
  $('#pcontent')[0].innerHTML=althtml;
}

function hascanvas(){
  return !!document.createElement( 'canvas' ).getContext;
}

function hascanvastext(){
  return (typeof(document.createElement( 'canvas' ).getContext('2d').fillText)== 'function');
}

var shadowCol="#676D72";
var textCol="#0C0C0C";
function drawPad(){
  activateShadow();
  drawPAD(stageRect.width,stageRect.height, 210,stageRect.y);
  deactivateShadow();

  ctx.save();
  textBlur()
  drawText("Drop Image Here",20,176,22,shadowCol);
  ctx.restore();
  drawText("Drop Image Here",20,175,22,textCol);
  ctx.save();
  textBlur()
  drawText("twitter username",39,48,18,shadowCol);
  ctx.restore();
  drawText("twitter username",39,47,18,textCol);

  ctx.drawImage(uimg,0,50,46,7,82,88,46,7);//divider
  ctx.drawImage(uimg,100,10,12,26,99,10,12,26);//arr
  drawBlackArrow();

  $('#drop_zone')[0].addEventListener('dragover', handleDragOver, false);
    $('#drop_zone')[0].addEventListener('drop', handleFileSelect, false);
  $('#drop_zone')[0].addEventListener('dragleave',handleDragLeave, false);



}
function textBlur(){
  return;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 1;
  ctx.shadowColor = shadowCol;
}
function drawText(str,ax,ay,asize,col){
  ctx.font = ' '+asize+'px "Helvetica"';
  ctx.fillStyle =col;
  ctx.fillText(str, ax, ay);
}
var piex=100;
var piey=100;
var pieR=50;
function drawPie(angle){
  piex=((stageRect.width)/2)-pieR;
  piey=((stageRect.height)/2)-pieR;
  ctx.globalAlpha=1;
  drawRAWThumb()
  ctx.globalAlpha=0.5;
  var a = (Math.PI/2)*(((angle/90))-1);


  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(piex+pieR,piey+pieR,pieR+2,0, Math.PI*2, true);

  ctx.stroke();

  ctx.globalAlpha=0.3;
  ctx.fillStyle   = '#000000';//'#2D62AB';//'#2e2e2e';//"rgb(0,0,0)";
  ctx.beginPath();
  ctx.moveTo(piex+pieR,piey+pieR);
  ctx.arc(piex+pieR,piey+pieR,pieR, 3*Math.PI/2, a, false);
  ctx.lineTo(piex+pieR,piey+pieR);
  ctx.fill();
}

function activateShadow(){
  ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
  ctx.shadowBlur = stageRect.x;
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
}

function deactivateShadow(){
  ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

function drawBlackArrow(){
  ctx.drawImage(uimg,0,0,43,46,82,120,43,46);
}

function drawBlueArrow(){
  ctx.drawImage(uimg,45,0,43,46,82,120,43,46);
}

function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  if(!isAnimating){
    isAnimating=true;
    resetFadeConst();
    fadeInBlue()
  }
}

function handleDragLeave(evt){
  evt.stopPropagation();
      evt.preventDefault();
  if(isAnimating){
    clearInterval(I);
    resetFadeConst();
    ctx.globalAlpha=1;
    drawBlackArrow();
    isAnimating=false;
  }
}

var opacity_step;
var opacity;
var isAnimating=false;
function fadeInBlue(){
  I= setInterval(function(){
      ctx.globalAlpha= (opacity) / 100;
      drawBlueArrow();
      opacity += opacity_step;
      if(opacity>=100){
        clearInterval(I);
        resetFadeConst();
        fadeInBlack();
      }
    }, 60);
}

function fadeInBlack(){
  I= setInterval(function(){
      ctx.globalAlpha= (opacity) / 100;
      drawBlackArrow();
      opacity+= opacity_step;
      if(opacity>=50){
        clearInterval(I);
        resetFadeConst()
        fadeInBlue();
      }
    }, 80);
}

function resetFadeConst(){
  opacity= 0;
  opacity_step= 10;
  ctx.globalAlpha=1;
}

function purgeAnimation(){
  clearInterval(I);
  resetFadeConst();
  isAnimating=false;

}

function onInvalidUsername(){
  $('#tz').fadeTo(0, 0);
  $('#tz').fadeTo(200, 1);
}
function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  var files = evt.dataTransfer.files;
  file=files[0];
  handleFile();
}
function handleFile() {

  if((file.type).substr(0,5) != "image"){
    return;
  }
  var itn=$('#tz').val();
  tname= itn.replace(/^\s+|\s+$/g, '') ;

  if(tname==""){
    onInvalidUsername()
    return;
  }

  ctx.clearRect(stageRect.x, stageRect.y, stageRect.width, stageRect.height);
  if(isAnimating){
    purgeAnimation();
  }

  image = new Image();
  var Wstepper=0;
  var Hstepper;
  var nPadW;
        image.onload = function(){
    $('#tz')[0].disabled=true;
    $('#tz').fadeTo('slow', 0.5);

    $('#drop_zone')[0].removeEventListener('dragover', handleDragOver, false);
    $('#drop_zone')[0].removeEventListener('drop', handleFileSelect, false);
    $('#drop_zone')[0].removeEventListener('dragleave',handleDragLeave, false);

    var scaleNum=getresizeRatio(image.width,image.height,mTW,mTH);

    iW=image.width*scaleNum;
    iH=image.height*scaleNum;
    var canW=iW+(2*stageRect.x)+(2*imgBorder);
    var canH=iH+(2*stageRect.y)+(2*imgBorder);
    var padW=iW+(2*imgBorder);
    var padH=iH+(2*imgBorder);

    var totalCalls=25;
    var callsCompleted=0;
    var callEvery=15;//every 10 ms; thus in 500 ms
    var WInc=(padW-stageRect.width)/totalCalls;
    var HInc=(padH-stageRect.height)/totalCalls;

    if(WInc>0){
      $('#stage').attr({width: canW})
    }
    if(HInc>0){
      $('#stage').attr({height:canH})
    }

    var canvaswidth=ctx.canvas.width;
    var canvasheight=ctx.canvas.height;
    I= setInterval(function(){
      //debugr(ctx.canvas.width)
      ctx.clearRect(0,0,canvaswidth,canvasheight);

      stageRect.width=stageRect.width+WInc;
      //debugr( stageRect.width)
      stageRect.height=stageRect.height+HInc;
      if(callsCompleted==totalCalls){
         clearInterval(I);
         stageRect.height=padH;
         stageRect.width=padW;
         if(WInc<0){
            $('#stage').attr({width: canW})
          }
          if(HInc<0){
            $('#stage').attr({height:canH})
          }
         drawPAD(stageRect.width,stageRect.height, canW,stageRect.y);
         deactivateShadow()
         showRawThumb();
      }else{
        drawPAD(stageRect.width,stageRect.height, canvaswidth,stageRect.y);
      }

      callsCompleted+=1;
    }, callEvery);

  }
  var reader = new FileReader();
  reader.onload = (function(e) {
      image.src = e.target.result;
  });

  reader.readAsDataURL(file);
}


function drawPAD(W,H,BoundW,Y){
  activateShadow();
  ctx.fillStyle   = '#3D4246';
  ctx.fillRect  ((BoundW-W)/2, Y, W, H);


}

function showRawThumb(){

  I= setInterval(function(){
      ctx.globalAlpha= (opacity) / 100;
      drawRAWThumb();

      opacity += opacity_step;
      if(opacity>=100){
        clearInterval(I);
        resetFadeConst();
        //$('#pregif').attr({style: "display: inline;"})
        processRAWImage();
      }
    }, 60);
}

function drawRAWThumb(){
  ctx.drawImage(image,0,0,image.width,image.height,imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);

}

function processRAWImage(){

  var scaleNum=getresizeRatio(image.width,image.height,processThumbW,processThumbH);
  processThumbW=Math.floor(image.width*scaleNum);
  processThumbH=Math.floor(image.height*scaleNum);

  var fctx = $("<canvas/>").attr({width: processThumbW,height: processThumbH})[0].getContext("2d");
  fctx.drawImage(image, 0, 0,processThumbW,processThumbH);
  fdata=fctx.getImageData(0, 0,processThumbW,processThumbH).data;
  //TwitterYQL(-1);
  processTiles();
}
function getresizeRatio(W,H,maxW,maxH){
  if((W>maxW)||(H>maxH)){
    var vertRatio=maxH/H;
    var horzRatio=maxW/W;
    var scaleNum=(horzRatio<=vertRatio)?horzRatio:vertRatio;
  }else{
    scaleNum=1;
  }
  return scaleNum;
}


function showMosaic(){
  opacity_step=3;
  I= setInterval(function(){
      ctx.globalAlpha= (opacity) / 100;
      //debugr(ctx.globalAlpha);
      ctx.drawImage(mosaiccan,imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
      opacity += opacity_step;
      if(opacity>=100){
        clearInterval(I);
        resetFadeConst();
        ctx.clearRect (imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
        ctx.drawImage(mosaiccan,imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
        setupInteraction();
        showZoomMouse();
        $('#info').fadeTo('slow', 1);
      }
    }, 40);
}

function setupInteraction(){
  var ac=0;
  var animateIn=800 ;//ms
  var aniFPS=50;
  var totalW=(ttw*processThumbW);
  var totalH=(tth*processThumbH)
  var callEvery=animateIn/aniFPS;
  var wInc=(totalW-iW)/callEvery;
  var HInc=(totalH-iH)/callEvery;
  var nW=iW;
  var nH=iH;


  ctx.beginPath();
  ctx.rect(imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
  ctx.clip();

  $("#stage").mousedown(function(e){
      var ofs = $("#stage").offset();
      var mx=(e.clientX-ofs.left)-(imgBorder+stageRect.x);
      var my=(e.clientY-ofs.top)-(imgBorder+stageRect.y);


      if(!(mx>0 && mx<iW && my>0 &&  my< iH))return;
      ac=1;
      var nx;
            var ny;
            $("#stage").css({'cursor':'default'});
      I= setInterval(function(){
        nW=nW+wInc;
        nH=nH+HInc;
                nx=(mx*(1-(nW/iW)));
        ny=(my*(1-(nH/iH)));

                ctx.clearRect(imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);

        if(nW>=totalW){

          nW=totalW;
          nH=totalH;
                    nx=(mx*(1-(nW/iW)));
                    ny=(my*(1-(nH/iH)));
                    ctx.drawImage(mosaiccan,nx+imgBorder+stageRect.x,ny+imgBorder+stageRect.y,nW,nH);

          clearInterval(I);
          //$("#stage").css({'cursor':'default'});
        }else{
                     ctx.drawImage(pscan,nx+imgBorder+stageRect.x,ny+imgBorder+stageRect.y,nW,nH);
                }



      },callEvery);
  });
  $("#stage").mouseup(function(e){

      if(ac==0)return;
      ac=0;
      //drawRAWThumb();
      nW=iW;
      nH=iH;
      clearInterval(I);
      ctx.clearRect (imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
      ctx.drawImage(mosaiccan,imgBorder+stageRect.x,imgBorder+stageRect.y,iW,iH);
      showZoomMouse()
  });

  $("#stage").mouseover(function(e){
    showZoomMouse()
  });


}

function showZoomMouse(){
  $("#stage").css({'cursor':'url(images/zoomin.png), -moz-zoom-in'});
}

// GET THUMBLIST STARTS ----------------

var dctx;
var mdctx;
var mosaiccan;
var ttw=20;
var tth=20;
var rC=0;
var ci;
var ri;
var gi;
var bi;
var t;
var dispw=300;
var disph=300;
var thumbsDict={};
var tname='';
var siteid="timepurge_com_";
var ftw;
var fth;


var maxThumbPages=2;
var currentThumbPage=1;

var ImagevoltKeys=[];
var localTiles=false;
var tpindex=-1;
var jsonAsStr=[];

function processTiles(){
  dctx = $("<canvas/>").attr({width: ttw,height: tth})[0].getContext("2d");

  if(localStorage[siteid+tname]){
    localTiles=true;
    ImagevoltKeys=localStorage[siteid+tname].split(" ");
    debugr(ImagevoltKeys)
    maxThumbPages=ImagevoltKeys.length-1;
    processLocalData(currentThumbPage-1)
  }else{
    TwitterYQL();
  }
}

function processLocalData(indx){
  var da=JSON.parse(localStorage[ImagevoltKeys[indx]]);
  var tdat=da.query.results.url;
  handleYQLJson(tdat);
}

var temp = 5;
function getTwitterPageIndex(){
  return onRTD({next_cursor:temp});
  debugr("getting index from twitter with tpindex:"+tpindex)
    var tsrc="http://api.twitter.com/1/statuses/followers.json?screen_name="+tname+"&cursor="+tpindex+"&callback=onRTD";
    $.ajax({
      url:tsrc,
      dataType: "jsonp"
    });
}

function onRTD(data){
    tpindex=(data.next_cursor);
    debugr("tpindex recieved:"+tpindex)
    if(tpindex!="0" ){
      debugr("calling YQL again with new index")
      temp--;
        TwitterYQL(tpindex);
    }else{
      debugr("returned 0 index. no more pages in twitter. Should procedd to localstorage ans process now")
      maxThumbPages=currentThumbPage;
      initM();
    }
}

function TwitterYQL(){
  debugr("Twitter YQL "+ tpindex)
  $('#pregif').attr({style: "display: inline;"})

handleYQLJson('');
  // var tsrc='http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from data.uri where url in (select users.user.profile_image_url from xml where url="http://api.twitter.com/1/statuses/followers.xml?cursor='+tpindex+'&screen_name=katyperry")')+'&format=json&diagnostics=true&callback=onTTR';
  // if(localStorage[siteid+tname]){
  //   var da=(JSON.parse(localStorage[siteid+tname]));
  //   handleYQLJson(da.query.results.url);
  // }else{
  //   $.ajax({
  //     url:tsrc,
  //     dataType: "jsonp"
  //   });
  // }
}

function resetLS(){
  var ln=(localStorage.length);
  var keys={};
  for (var i = 0; i < ln; i++){
    keys[i]=localStorage.key(i);
  }
  for (var k in keys){
    delete localStorage[keys[k]];
  }
}


function onTTR(data){
    // if(!data.query.results){
    //   alert("Cannot find any follower for this user!\nTry someone else.");
    //   return;
    // }
    // if(!localTiles){
    //   debugr("pushing json as string to array");
    //   var jstrfy=JSON.stringify(data)
    //   jsonAsStr.push(jstrfy);
    // }
    $('#pregif').attr({style: "display: none;"})
    handleYQLJson();
}

var imgnum = 1;
function handleYQLJson(twitterDs){
    var counter=0, tot = 50;

    for (var i=0;i<50;i++){
      if(true){
        if(true){
          $("<img/>").load(function() {
            try{

              dctx.clearRect (0,0,ttw,tth);
              dctx.drawImage(this,0,0,ttw,tth);
              thumb2RGB(dctx.getImageData(0, 0, ttw,tth).data,ttw,tth,this);


            }catch(err){

            }
            counter+=1;
            if (counter==tot){
              initM();
            }

          }).attr('src', 'images/' + imgnum++ + '.jpg');
          imgnum = imgnum == 14 ? 1 : imgnum;
        }else{
          tot=tot-1;
          if (counter==tot){
            initM();
          }
        }

      }else{
        tot=tot-1;
        if (counter==tot){
          initM();
        }

      }


    }
}
var imgDict={};
function thumb2RGB(imgdata,iw,ih,t){
  var r=0;
  var g=0;
  var b=0;
  var count=imgdata.length;

  for( var y=0 ; y<count ; y += 4){
    r=r+imgdata[y];
    g=g+imgdata[y+1];
    b=b+imgdata[y+2];
  }
  count=count/4;

  var tObj=new Object();
  tObj.r=Math.round(r/count);
  tObj.g=Math.round(g/count);
  tObj.b=Math.round(b/count);
  var id=""+tObj.r+tObj.g+tObj.b;


  if(thumbsDict[id]){}else{

    thumbsDict[id]=tObj;
    imgDict[id]=t;
  }
}



function saveJSON(){
  var saved=true;
  var voltkeystr="";
  for(var i=0; i<jsonAsStr.length; i++){
    var imgVoltKey=new Date().getTime()+Math.ceil(Math.random()*100000);
    voltkeystr=voltkeystr+imgVoltKey+" ";
    try {
      debugr("saved to local");
      localStorage[imgVoltKey]=jsonAsStr[i];
    }catch(e) {
      saved=false;
      break;
    }
  }
  if(saved){
    try {
      localStorage[siteid+tname]=voltkeystr;
    }catch(e){
      saved=false;
    }
  }

  return saved;

}

function processMorePages(){
  currentThumbPage+=1;
  if(localTiles){
    processLocalData(currentThumbPage-1);
  }else{
    getTwitterPageIndex();
  }
}

function initM(){
    if(maxThumbPages!=currentThumbPage){

      var tper=180*(currentThumbPage/maxThumbPages);
      drawPie(tper);
      processMorePages()
      return;
    }

    if(!localTiles){
      if(!saveJSON()){
        resetLS();
        saveJSON();
      }
    }

    ftw=processThumbW;
    fth=processThumbH;
    var finw=ttw*processThumbW;
    var finh=tth*processThumbH;
    mdctx=$("<canvas/>").attr({width: finw,height: finh,id:"dum"})[0].getContext('2d');
    mosaiccan=mdctx.canvas;

    var jtl=0;
    for(kl in thumbsDict){
      jtl+=1;
    }
    debugr("A TOTAL OF "+jtl +" thumbs");

    var wdat=new Object();
    wdat.ftw=ftw;
    wdat.fth=fth;
    wdat.fdata=fdata;
    wdat.thumbsDict=thumbsDict;
    wdat.ttw=ttw;
    wdat.tth=tth;

    var worker = new Worker(workrjs);
    worker.addEventListener('message', function(e) {

      switch(e.data.c){
                case "D":
                      mdctx.drawImage(imgDict[e.data.k], (e.data.x*ttw), e.data.rC*tth,ttw,tth);
                      break;
                case "P":
                    var tper=180+ (e.data.p/2)
                    drawPie(tper);
                    break;
                case "E":
                    createPseudoCan();
                    showMosaic();
                    break;
                case "L":
                    //debugr(e.data.log);
                    break;
            }

    }, false);


    worker.postMessage(wdat);

}

var psctx;
var pscan;
function createPseudoCan(){
    var scaleNum=getresizeRatio(image.width,image.height,500,500);
    var pW=image.width*scaleNum;
    var pH=image.height*scaleNum;
    psctx=$("<canvas/>").attr({width:pW,height: pH,id:"ps"})[0].getContext('2d');
    pscan=psctx.canvas;
    psctx.drawImage(mosaiccan,0,0,pW,pH);
}

function refresh_mosaic()
{
    window.location.reload();

}


function download_mosaic(){

  var totW=(ttw*processThumbW);
  var totH=(tth*processThumbH)
  $("<div/>").attr({id:"modal",style:"opacity: 0.8;z-index: 9;background-color: #000000;position: absolute;width: 100%;height: 100%;top: 0px;left: 0px;"}).appendTo($("body"));
  $("<div/>").attr({id:"hires", style:"display: none;z-index: 10;position: absolute;top: 10px;text-align: center;width: 100%;font-size:12px;"}).appendTo($("body"));
  $("<span/>").attr({ style:"background-color:yellow;", innerHTML:totW+" &#10799 "+totH+" pixels | Right click->Save<br/>"}).appendTo($("#hires"));

  $("<img/>").load(function() {
                $("#hires").append(this).fadeIn('slow');
    $("#hires").append('<br/><br/><a href="#" onclick="cleanup()" style="text-decoration:none;background-color:transparent"><img src="images/prg.png" width="21px" height="21px" style="border:none;" alt="Close"/></a>');
  }).attr({'src': mosaiccan.toDataURL("image/png"), height:500});
}
function debugr(s){
  //console.log(s);
}
function cleanup(){
  $("#modal").remove();
  $("#hires").remove();
}
$(init);
