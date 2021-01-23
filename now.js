var BirthDay = null;
var DeathDay = null;
var DateBirthday = null;
var TimeBirthday = null;

var BirthY = null;
var BirthMo = null;
var BirthD = null;
var BirthH = null;
var BirthMi = null;

const Week = new Date(Date.UTC(1970, 0, 8));
const GridBorder = 25;
var LifeWeeks = 0;
var r = 0;
var c = 0;
var BSize = 0;

function HEXtoRGB(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

function updateDate() {
  DateBirthday = localStorage.getItem("DateBirthday").split("-");
  TimeBirthday = localStorage.getItem("TimeBirthday").split(":");

  BirthY = parseInt(DateBirthday[0]);
  BirthMo = parseInt(DateBirthday[1]) - 1; // month is 0-indexed
  BirthD = parseInt(DateBirthday[2]);
  BirthH = parseInt(TimeBirthday[0]);
  BirthMi = parseInt(TimeBirthday[1]);
  let DeathAge = parseInt(localStorage.getItem("DeathAge"));

  BirthDay = new Date(BirthY, BirthMo, BirthD, BirthH, BirthMi);
  DeathDay = new Date(BirthY + DeathAge, BirthMo, BirthD, BirthH, BirthMi);
  LifeWeeks = Math.ceil((DeathDay - BirthDay) / Week);

  if (width / height < 0.6) {
    r = Math.ceil(Math.sqrt(LifeWeeks / (width / height)));
  } else {
    r = Math.round(Math.sqrt(LifeWeeks / (width / height)));
  }
  c = Math.ceil(LifeWeeks / r);

  BSize = Math.min((width - GridBorder * 2) / c, (height - GridBorder * 2) / r);
}

function automateInput(id, data, isDate) {
  let obj = document.getElementById(id);
  if (!localStorage.getItem(id)) {
    localStorage.setItem(id, obj[data]);
  }
  obj[data] = localStorage.getItem(id);
  if (!isDate) {
    obj.addEventListener("change", function () {
      localStorage.setItem(id, obj[data]);
    });
  } else {
    obj.addEventListener("change", function () {
      localStorage.setItem(id, obj[data]);
      updateDate();
    });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  automateInput("ColorBG", "value", false);
  automateInput("ColorText", "value", false);
  automateInput("ShowBirthday", "checked", false);
  automateInput("ShowGrid", "checked", false);
  automateInput("GridAlpha", "value", false);
  automateInput("ColorGone", "value", false);
  automateInput("DateBirthday", "value", true);
  automateInput("TimeBirthday", "value", true);
  automateInput("DeathAge", "value", true);
  updateDate();
}

function draw() {
  background(localStorage.getItem("ColorBG"));

  document.body.style.backgroundColor = localStorage.getItem("ColorBG");
  document.getElementsByClassName("openbtn")[0].style.color = localStorage.getItem("ColorText");

  let Now = new Date();
  let Weeks = (Now - BirthDay) / Week;

  /* Grid */

  if (localStorage.getItem("ShowGrid") == "true") {

    // how much is left by the grid border, to centralize the grid
    const cRest = (width - BSize * c - GridBorder * 2) / 2;
    const rRest = (height - BSize * r - GridBorder * 2) / 2;

    // how many complete rows have been lived
    let rComplete = Math.floor(Weeks / c);
    // how many complete columns have been lived, at the incomplete row
    let cComplete = Math.floor(Weeks - rComplete * c);

    noStroke();
    fill(HEXtoRGB(localStorage.getItem("ColorGone"), parseFloat(localStorage.getItem("GridAlpha"))/100));

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
    stroke(HEXtoRGB(localStorage.getItem("ColorText"), parseFloat(localStorage.getItem("GridAlpha"))/100));
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
  }

  /* Text */

  noStroke();
  fill(localStorage.getItem("ColorText"));

  var YearStart = new Date(year(), 0);
  var YearEnd = new Date(year() + 1, 0);
  var YearNow = (year() + (Now - YearStart) / (YearEnd - YearStart)).toFixed(12);


  var BirthComp = new Date(year(), BirthMo, BirthD, BirthH, BirthMi);

  if (BirthComp <= Now) {
    var Age = year() - BirthY - 1;
    var AgeStart = new Date(year() - 1, BirthMo, BirthD, BirthH, BirthMi);
    var AgeEnd = new Date(year(), BirthMo, BirthD, BirthH, BirthMi) - AgeStart;
  } else {
    var Age = year() - BirthY;
    var AgeStart = new Date(year(), BirthMo, BirthD, BirthH, BirthMi);
    var AgeEnd = new Date(year() + 1, BirthMo, BirthD, BirthH, BirthMi) - AgeStart;
  }
  document.getElementById("DeathAge").min = Age;
  var AgeNow = (Now - AgeStart) / AgeEnd;

  let digits = Math.floor(Math.max(0, Math.log10(Age))) + 1;

  var AgeText = "";
  if (localStorage.getItem("ShowBirthday") == "true") {
    AgeText = "\n" + " ".repeat(4 - digits) + (Age + AgeNow).toFixed(12);
  }

  text(YearNow + AgeText, width / 2, height / 2);
}
