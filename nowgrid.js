const DeathAge = 100;
const BirthY = 1997;
const BirthMo = 10; // month is 0-indexed
const BirthD = 7;
const BirthH = 17;
const BirthMi = 11;

const BirthDay = new Date(BirthY, BirthMo, BirthD, BirthH, BirthMi);
const DeathDay = new Date(BirthY + DeathAge, BirthMo, BirthD, BirthH, BirthMi);
const Week = new Date(Date.UTC(1970, 0, 8));

const GridBorder = 25;
const LifeWeeks = Math.ceil((DeathDay - BirthDay) / Week);
var r = 0;
var c = 0;
var BSize = 0;

const Green100 = 'rgba(102, 255, 102, 1)';
const Green040 = 'rgba(102, 255, 102, 0.4)';
const Grey080 = 'rgba(62, 74, 60, 0.8)';

var YearStart = null;
var YearEnd = null;
var Age = null;
var AgeStart = null;
var AgeEnd = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2 * displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  if (width / height < 0.6) {
    r = Math.ceil(Math.sqrt(LifeWeeks / (width / height)));
  } else {
    r = Math.round(Math.sqrt(LifeWeeks / (width / height)));
  }
  c = Math.ceil(LifeWeeks / r);

  BSize = Math.min((width - GridBorder * 2) / c, (height - GridBorder * 2) / r);

  YearStart = new Date(year(), 0);
  YearEnd = new Date(year() + 1, 0);
  Age = year() - BirthY - 1;
  AgeStart = new Date(year() - 1, BirthMo, BirthD, BirthH, BirthMi);
  AgeEnd = new Date(year(), BirthMo, BirthD, BirthH, BirthMi) - AgeStart;
}

function draw() {
  background(0);

  let Now = new Date();
  let Weeks = (Now - BirthDay) / Week;


  // how much is left by the grid border, to centralize the grid
  const cRest = (width - BSize * c - GridBorder * 2) / 2;
  const rRest = (height - BSize * r - GridBorder * 2) / 2;

  noStroke();
  fill(Grey080);

  // how many complete rows have been lived
  let rComplete = Math.floor(Weeks / c);
  // how many complete columns have been lived, at the incomplete row
  let cComplete = Math.floor(Weeks - rComplete * c);

  // one big rect to fill all complete rows
  rect(GridBorder + cRest, GridBorder + rRest,
    c * BSize, rComplete * BSize);

  // rect to fill columns at the incomplete row
  rect(GridBorder + cRest, rComplete * BSize + GridBorder + rRest,
    cComplete * BSize, BSize);

  // actual week, being completed
  rect(cComplete * BSize + GridBorder + cRest,
    rComplete * BSize + GridBorder + rRest,
    BSize, BSize * (Weeks % 1));


  strokeWeight(1);
  stroke(Green040);
  noFill();

  // how many complete columns have at the incomplete row of LifeWeeks
  cComplete = Math.floor(LifeWeeks - Math.floor(LifeWeeks / c) * c);

  let j = 0;
  let i = 0;

  // horizontal lines of the grid
  for (j = 0; j < r; j++) {
    line(GridBorder + cRest, j * BSize + GridBorder + rRest,
      c * BSize + GridBorder + cRest, j * BSize + GridBorder + rRest);
  }
  // last, possibly, incomplete horizontal line
  line(GridBorder + cRest, j * BSize + GridBorder + rRest,
    cComplete * BSize + GridBorder + cRest, j * BSize + GridBorder + rRest);

  // if the last row of the grid is incomplete
  if (cComplete > 0) {
    // vertical lines of the grid
    // up to the bottom of the grid
    for (i = 0; i <= cComplete; i++) {
      line(i * BSize + GridBorder + cRest, GridBorder + rRest,
        i * BSize + GridBorder + cRest, r * BSize + GridBorder + rRest);
    }

    // vertical lines of the grid
    // up to the bottom of the grid - 1 (incomplete row)
    for (; i <= c; i++) {
      line(i * BSize + GridBorder + cRest, GridBorder + rRest,
        i * BSize + GridBorder + cRest, (r - 1) * BSize + GridBorder + rRest);
    }
  } else {
    // last horizontal line
    line(GridBorder + cRest, j * BSize + GridBorder + rRest,
      c * BSize + GridBorder + cRest, j * BSize + GridBorder + rRest);

    // vertical lines of the grid
    // up to the bottom of the grid
    for (i = 0; i <= c; i++) {
      line(i * BSize + GridBorder + cRest, GridBorder + rRest,
        i * BSize + GridBorder + cRest, r * BSize + GridBorder + rRest);
    }
  }


  noStroke();
  fill(Green100);

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
