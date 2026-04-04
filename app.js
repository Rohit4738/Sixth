const cv = document.getElementById('cv'),
      ctx = cv.getContext('2d');

let score = 0,
    keys = {};

const player = { x:220, y:280, w:40, h:20, speed:4 };
const bullets = [],
      enemies = [],
      stars = [];

function drawRect(r,c){
  ctx.fillStyle = c;
  ctx.fillRect(r.x, r.y, r.w, r.h);
}

function spawnEnemy(){
  enemies.push({
    x: Math.random()*(cv.width-30),
    y: -30,
    w: 30,
    h: 30,
    speed: 2 + Math.random()*2
  });
}

function spawnStar(){
  stars.push({
    x: Math.random()*(cv.width-10),
    y: -10,
    w: 10,
    h: 10,
    speed: 1
  });
}

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update(){
  if(keys['ArrowLeft'] && player.x > 0)
    player.x -= player.speed;

  if(keys['ArrowRight'] && player.x < cv.width - player.w)
    player.x += player.speed;

  if(keys[' ']){
    bullets.push({
      x: player.x + player.w/2 - 2,
      y: player.y,
      w: 4,
      h: 10,
      speed: 6
    });
    keys[' '] = false;
  }

  bullets.forEach((b,i)=>{
    b.y -= b.speed;
    if(b.y < 0) bullets.splice(i,1);
  });

  enemies.forEach((e,ei)=>{
    e.y += e.speed;
    if(e.y > cv.height) enemies.splice(ei,1);

    bullets.forEach((b,bi)=>{
      if(
        b.x < e.x + e.w &&
        b.x + b.w > e.x &&
        b.y < e.y + e.h &&
        b.y + b.h > e.y
      ){
        enemies.splice(ei,1);
        bullets.splice(bi,1);
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
      }
    });

    if(
      e.x < player.x + player.w &&
      e.x + e.w > player.x &&
      e.y < player.y + player.h &&
      e.y + e.h > player.y
    ){
      alert('Game Over! Score: ' + score);
      location.reload();
    }
  });

  stars.forEach((s,i)=>{
    s.y += s.speed;
    if(s.y > cv.height) stars.splice(i,1);
  });

  if(Math.random() < 0.02) spawnEnemy();
  if(Math.random() < 0.1) spawnStar();
}

function draw(){
  ctx.clearRect(0,0,cv.width,cv.height);

  stars.forEach(s => drawRect(s,'#fff'));
  drawRect(player,'#0af');
  bullets.forEach(b => drawRect(b,'#ff0'));
  enemies.forEach(e => drawRect(e,'#f33'));
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
