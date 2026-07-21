import { getPublicPhotos } from "@/lib/data";

export const dynamic = "force-dynamic";

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function GET(request: Request) {
  const interval = Number(new URL(request.url).searchParams.get("intervalo") ?? 8);
  const seconds = Number.isFinite(interval) ? Math.min(60, Math.max(3, Math.round(interval))) : 8;
  const photos = await getPublicPhotos(150);
  const urls = photos.map((photo) => photo.publicUrl);
  const serialized = JSON.stringify(urls).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  const first = urls[0] ? escapeAttribute(urls[0]) : "";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Galeria ao vivo | Uma Aventura Congelante</title>
  <style>
    html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#031d33;color:#fff;font-family:Arial,Helvetica,sans-serif}
    #stage{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;background:#031d33}
    #backdrop{position:absolute;left:-5%;top:-5%;width:110%;height:110%;background-position:center;background-repeat:no-repeat;background-size:cover;opacity:.2;filter:blur(28px)}
    #photo{position:absolute;display:block;opacity:1;transition:opacity .45s ease}
    #empty{position:absolute;left:8%;right:8%;top:36%;text-align:center;display:none}
    #empty h1{font-family:Georgia,'Times New Roman',serif;font-size:52px;font-weight:normal;margin:0 0 14px;color:#dff5ff}
    #empty p{font-size:24px;margin:0;color:#b9dced}
    #controls{position:absolute;z-index:5;left:50%;bottom:22px;white-space:nowrap;padding:8px;background:rgba(0,12,24,.72);border:1px solid rgba(255,255,255,.28);border-radius:30px;transform:translateX(-50%)}
    #controls button,#controls select{height:44px;min-width:54px;margin:0 3px;padding:0 13px;border:0;border-radius:22px;background:rgba(255,255,255,.14);color:#fff;font:bold 16px Arial,Helvetica,sans-serif;vertical-align:middle;cursor:pointer}
    #controls button:focus,#controls select:focus{outline:3px solid #7dd8ff;background:#fff;color:#07395d}
    #controls option{color:#000;background:#fff}
    #status{position:absolute;right:18px;top:16px;z-index:6;padding:7px 11px;border-radius:15px;background:rgba(0,12,24,.55);font-size:13px;color:#dff5ff}
  </style>
</head>
<body>
  <div id="stage">
    <div id="backdrop"></div>
    <img id="photo" src="${first}" alt="Foto da festa">
    <div id="empty"><h1>A magia começa em instantes</h1><p>As fotos aprovadas aparecerão aqui automaticamente.</p></div>
    <div id="status">Modo Smart TV</div>
    <div id="controls">
      <button id="pause" type="button">Pausar</button>
      <button id="shuffle" type="button">Aleatório: não</button>
      <select id="interval" aria-label="Intervalo entre fotos"><option value="5">5s</option><option value="8">8s</option><option value="12">12s</option><option value="15">15s</option></select>
      <button id="fullscreen" type="button">Tela cheia</button>
    </div>
  </div>
  <script>
    (function(){
      var photos=${serialized};
      var index=0;
      var seconds=${seconds};
      var paused=false;
      var shuffled=false;
      var timer=null;
      var photo=document.getElementById('photo');
      var backdrop=document.getElementById('backdrop');
      var empty=document.getElementById('empty');
      var pauseButton=document.getElementById('pause');
      var shuffleButton=document.getElementById('shuffle');
      var intervalSelect=document.getElementById('interval');

      function fitPhoto(){
        if(!photo.naturalWidth||!photo.naturalHeight){return;}
        var width=document.documentElement.clientWidth||window.innerWidth;
        var height=document.documentElement.clientHeight||window.innerHeight;
        var imageRatio=photo.naturalWidth/photo.naturalHeight;
        var screenRatio=width/height;
        var finalWidth,finalHeight;
        if(imageRatio>screenRatio){finalWidth=width;finalHeight=Math.round(width/imageRatio);}else{finalHeight=height;finalWidth=Math.round(height*imageRatio);}
        photo.style.width=finalWidth+'px';
        photo.style.height=finalHeight+'px';
        photo.style.left=Math.round((width-finalWidth)/2)+'px';
        photo.style.top=Math.round((height-finalHeight)/2)+'px';
        photo.style.opacity='1';
      }

      function showCurrent(){
        if(!photos.length){photo.style.display='none';backdrop.style.display='none';empty.style.display='block';return;}
        empty.style.display='none';photo.style.display='block';backdrop.style.display='block';
        var url=photos[index%photos.length];
        photo.style.opacity='0';
        photo.onload=fitPhoto;
        photo.src=url;
        backdrop.style.backgroundImage='url("'+url.replace(/"/g,'%22')+'")';
        if(photos.length>1){var preload=new Image();preload.src=photos[(index+1)%photos.length];}
      }

      function nextPhoto(){
        if(paused||photos.length<2){return;}
        if(shuffled){index=(index+1+Math.floor(Math.random()*(photos.length-1)))%photos.length;}else{index=(index+1)%photos.length;}
        showCurrent();
      }

      function restartTimer(){if(timer){window.clearInterval(timer);}timer=window.setInterval(nextPhoto,seconds*1000);}
      function refresh(){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
          if(xhr.readyState===4&&xhr.status>=200&&xhr.status<300){
            try{var data=JSON.parse(xhr.responseText);var fresh=[];var i;for(i=0;i<data.photos.length;i++){fresh.push(data.photos[i].publicUrl);}photos=fresh;if(index>=photos.length){index=0;}showCurrent();}catch(error){}
          }
        };
        xhr.open('GET','/api/gallery?tv='+(new Date().getTime()),true);xhr.send();
      }

      photo.onload=fitPhoto;
      window.onresize=fitPhoto;
      pauseButton.onclick=function(){paused=!paused;pauseButton.innerHTML=paused?'Continuar':'Pausar';};
      shuffleButton.onclick=function(){shuffled=!shuffled;shuffleButton.innerHTML=shuffled?'Aleatório: sim':'Aleatório: não';};
      intervalSelect.value=String(seconds);
      intervalSelect.onchange=function(){seconds=parseInt(intervalSelect.value,10)||8;restartTimer();};
      document.getElementById('fullscreen').onclick=function(){var root=document.documentElement;var open=root.requestFullscreen||root.webkitRequestFullscreen||root.msRequestFullscreen;if(open){open.call(root);}};
      if(photos.length){showCurrent();}else{empty.style.display='block';photo.style.display='none';backdrop.style.display='none';}
      restartTimer();
      window.setInterval(refresh,12000);
    }());
  </script>
</body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
