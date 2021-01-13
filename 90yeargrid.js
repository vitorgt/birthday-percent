const ys = 100;
const y = 1997;
const m = 10; // month is 0-indexed
const d = 7;
const h = 17;
const i = 11;

const BirthDay = new Date(y, m, d, h, i);
const DeathDay = new Date(y + ys, m, d, h, i);
const Week = new Date(Date.UTC(1970, 0, 8));

const t = 25;
const n = Math.ceil((DeathDay - BirthDay) / Week);
var r = 0;
var c = 0;
var dis = 0;
const alph = 0.5;
var BSize = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  if (width / height < 0.6) {
    r = Math.ceil(Math.sqrt(n / (width / height)));
  } else {
    r = Math.round(Math.sqrt(n / (width / height)));
  }
  c = Math.ceil(n / r);
  console.log(width / height, r, c, r * c, n);

  BSize = Math.min((width - t * 2) / c, (height - t * 2) / r);
  dis = BSize / 4;
}

function draw() {
  background(0);
  fill(102, 255, 102);

  const irest = (width - BSize * c - t * 2) / 2;
  const jrest = (height - BSize * r - t * 2) / 2;

  let Now = new Date();
  let Weeks = (Now - BirthDay) / Week;

  const YearStart = new Date(year(), 0);
  const YearEnd = new Date(year() + 1, 0) - YearStart;
  let YearNow = (year() + (Now - YearStart) / YearEnd).toFixed(12);

  let count = 0;
  let j = 0;
  let i = 0;

  let green1 = 'rgba(102, 255, 102, 1)';
  let greenAlpha = 'rgba(102, 255, 102, ' + alph + ')';
  let grey1 = 'rgba(62, 74, 60, ' + alph + ')';

  strokeWeight(0.3);
  stroke(greenAlpha);
  fill(grey1);
  for (j = 0; j < r && count < Math.floor(Weeks); j++) {
    for (i = 0; i < c && count < Math.floor(Weeks); i++, count++) {
      rect(i * BSize + t + irest, j * BSize + t + jrest, BSize - dis, BSize - dis);
    }
    if (count >= Math.floor(Weeks)) break;
  }

  noFill();
  rect(i * BSize + t + irest, j * BSize + t + jrest, BSize - dis, BSize - dis);

  noStroke();
  fill(grey1);
  rect(i * BSize + t + irest, j * BSize + t + jrest, BSize - dis, (BSize - dis) * (Weeks % 1));

  i++;

  strokeWeight(0.3);
  stroke(greenAlpha);
  noFill();
  for (; i < c && count < n; i++, count++) {
    rect(i * BSize + t + irest, j * BSize + t + jrest, BSize - dis, BSize - dis);
  }
  j++;
  for (; j < r && count < n; j++) {
    for (i = 0; i < c && count < n; i++, count++) {
      rect(i * BSize + t + irest, j * BSize + t + jrest, BSize - dis, BSize - dis);
    }
  }


  noStroke();
  fill(green1);
  var BirthStart = new Date(year() - 1, m, d, h, i);
  var BirthEnd = new Date(year(), m, d, h, i) - BirthStart;
  var Age = year() - y - 1;
  var BirthNow = (Now - BirthStart) / BirthEnd;
  if (BirthNow >= 1) {
    BirthStart = new Date(year(), m, d, h, i);
    BirthEnd = new Date(year() + 1, m, d, h, i) - BirthStart;
    Age = year() - y;
    BirthNow = (Now - BirthStart) / BirthEnd;
  }

  text(YearNow + "\n  " + (Age + BirthNow).toFixed(12),
    width / 2, height / 2);
}