const BirthY = 1997;
const BirthMo = 10; // month is 0-indexed
const BirthD = 7;
const BirthH = 17;
const BirthMi = 11;

const Green100 = 'rgba(102, 255, 102, 1)';

var YearStart = null;
var YearEnd = null;
var Age = null;
var AgeStart = null;
var AgeEnd = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  YearStart = new Date(year(), 0);
  YearEnd = new Date(year() + 1, 0);
  Age = year() - BirthY - 1;
  AgeStart = new Date(year() - 1, BirthMo, BirthD, BirthH, BirthMi);
  AgeEnd = new Date(year(), BirthMo, BirthD, BirthH, BirthMi) - AgeStart;
}

function draw() {
  background(0);
  noStroke();
  fill(Green100);

  let Now = new Date();

  let YearNow = (year() + (Now - YearStart) / (YearEnd - YearStart)).toFixed(12);
  let AgeNow = (Now - AgeStart) / AgeEnd;

  if (AgeNow >= 1) {
    AgeStart = new Date(year(), BirthMo, BirthD, BirthH, BirthMi);
    AgeEnd = new Date(year() + 1, BirthMo, BirthD, BirthH, BirthMi) - AgeStart;
    Age = year() - BirthY;
  }

  text(YearNow + "\n  " + (Age + AgeNow).toFixed(12),
    width / 2, height / 2);
}