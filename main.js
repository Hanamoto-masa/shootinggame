// ゲームスピード
const GAME_SPEED = 1000/60;

// 画面サイズ
const SCREEN_W = 180;
const SCREEN_H = 320;

// キャンバスサイズ
const CANVAS_W = SCREEN_W *2;
const CANVAS_H = SCREEN_H *2;

// フィールドサイズ
const FIELD_W = SCREEN_W *2;
const FIELD_H = SCREEN_H *2;

// 星の数
const STAR_MAX = 300;

// キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = CANVAS_W;
can.height = CANVAS_H;

// フィールド（仮想画面）
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width  = FIELD_W;
vcan.height = FIELD_H;

// カメラの座標
let camera_x = 0;
let camera_y = 0;

// 星の実体
let star = [];

// ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";

// スプライトクラス
class Sprite{
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

// スプライト
let sprite = [
  new Sprite(2,0,60,61),
  new Sprite(77,0,47,60),
  new Sprite(134,0,45,64),
];

// スプライトの描画
function drawSprite(snum,x,y){
  let sx = sprite[snum].x;
  let sy = sprite[snum].y;
  let sw = sprite[snum].w;
  let sh = sprite[snum].h;

  let px = (x>>8) - sw/2;
  let py = (y>>8) - sh/2;

  if(px+sw/2<camera_x || px-sw/2>=camera_x+SCREEN_W
    ||py+sh/2<camera_y || py-sh/2>=camera_x+SCREEN_H)return;

  vcon.drawImage(spriteImage,sx,sy,sw,sh,px,py,sw,sh);
}

// 整数のランダムを作るr
function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

// 星
class Star{
  constructor(){
    this.x  = rand(0,FIELD_W)<<8;
    this.y  = rand(0,FIELD_H)<<8;
    this.vx = 0;
    this.vy = rand(30,200);
    this.sz = rand(1,2);
  }

  draw(){
    let x = this.x>>8;
    let y = this.y>>8;
    if(x<camera_x || x>=camera_x+SCREEN_W
       ||y<camera_y || y>=camera_x+SCREEN_H)return;

    vcon.fillStyle = rand(0,2)!=0?"66f":"#8af";
    vcon.fillRect(x,y,this.sz,this.sz);

  }

  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.y>FIELD_H<<8){
      this.y = 0;
      this.x = rand(0,FIELD_W)<<8;
    }
  }
}



function gameInit(){
  for(let i = 0;i<STAR_MAX;i++)star[i] = new Star();
  setInterval(gameLoop,GAME_SPEED);
}

// ゲームループ
function gameLoop(){

  // 移動の処理
  for(let i = 0;i<STAR_MAX;i++)star[i].update();

  // 　描画の処理
  vcon.fillStyle = "black";
  vcon.fillRect(0,0,SCREEN_W,SCREEN_H);

  for(let i = 0;i<STAR_MAX;i++)star[i].draw();

  drawSprite(0,100<<8,100<<8);

  // 仮想画面から実際のキャンバスにコピー
  con.drawImage(vcan,camera_x,camera_y,SCREEN_W,SCREEN_H,
    0,0,CANVAS_W,CANVAS_H);

}

// オンロードでゲーム開始
window.onload = function(){
  gameInit();
}