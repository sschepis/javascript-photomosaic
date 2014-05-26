var fth,ftw,fdata,thumbsDict,ttw,tth;

var dmsg=new Object();
dmsg.p=0;
dmsg.c="D";
function buildMo(){
    for(var rC=0; rC<fth ; rC+=1){
        for(x=0 ; x< ftw; x+=1){
		var diff;
        var matchedKEY;
		ci= (x + rC * ftw) * 4;
		ri=fdata[ci];
		gi=fdata[ci+1];
		bi=fdata[ci+2];
		
		for (key in thumbsDict){
			
			var _tmo=thumbsDict[key];
			//plog(_tmo.r);
			var diffx=Math.sqrt(Math.pow(Math.abs(ri-_tmo.r),2)+Math.pow(Math.abs(gi-_tmo.g),2)+Math.pow(Math.abs(bi-_tmo.b),2) );

			if(diff){
				if(diffx<diff){
					diff=diffx;
					matchedKEY=key;
				}
			}else{
				diff=diffx;
				matchedKEY=key;
			}


		}
		 
        dmsg.k=matchedKEY;
        dmsg.rC=rC;
        dmsg.x=x;
        self.postMessage(dmsg);
        
		diff=undefined;
        matchedKEY=undefined;
        }
        if(rC>0){
            dmsg.c="P";
            dmsg.p=Math.floor(359*rC/fth);
            self.postMessage(dmsg);
            dmsg.c="D";
        }
        
    }
    dmsg.c="E";
    self.postMessage(dmsg);
    self.close() ;
}

function plog(ar){
    var st= dmsg.c;
     dmsg.c="L";
    dmsg.log=ar;
    self.postMessage(dmsg);
     dmsg.c=st;
}

self.addEventListener('message', function(e) {
  var wdat=e.data;
  fth=wdat.fth;
  ftw=wdat.ftw;
  fdata=wdat.fdata;
  thumbsDict=wdat.thumbsDict;
  ttw=wdat.ttw;
  tth=wdat.tth;
  buildMo()
}, false);