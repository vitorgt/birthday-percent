function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);
}

function draw() {
  var ColorBG = document.getElementById("ColorBG").value;
  var ColorText = document.getElementById("ColorText").value;
  var ShowBirthday = document.getElementById("ShowBirthday").checked;
  var DateBirthday = document.getElementById("DateBirthday").value.split("-");
  var TimeBirthday = document.getElementById("TimeBirthday").value.split(":");

  document.body.style.backgroundColor = ColorBG;
  document.getElementsByClassName("openbtn")[0].style.color = ColorText;

  background(ColorBG);
  noStroke();
  fill(ColorText);

  let Now = new Date();

  var YearStart = new Date(year(), 0);
  var YearEnd = new Date(year() + 1, 0);
  var YearNow = (year() + (Now - YearStart) / (YearEnd - YearStart)).toFixed(12);

  var AgeText = "";

  if (ShowBirthday) {
    var BirthY = DateBirthday[0];
    var BirthMo = DateBirthday[1] - 1; // month is 0-indexed
    var BirthD = DateBirthday[2];
    var BirthH = TimeBirthday[0];
    var BirthMi = TimeBirthday[1];
    var BirthS = TimeBirthday[2];

    var BirthComp = new Date(year(), BirthMo, BirthD, BirthH, BirthMi, BirthS);

    if (BirthComp <= Now) {
      var Age = year() - BirthY - 1;
      var AgeStart = new Date(year() - 1, BirthMo, BirthD, BirthH, BirthMi, BirthS);
      var AgeEnd = new Date(year(), BirthMo, BirthD, BirthH, BirthMi, BirthS) - AgeStart;
    } else {
      var Age = year() - BirthY;
      var AgeStart = new Date(year(), BirthMo, BirthD, BirthH, BirthMi, BirthS);
      var AgeEnd = new Date(year() + 1, BirthMo, BirthD, BirthH, BirthMi, BirthS) - AgeStart;
    }
    var AgeNow = (Now - AgeStart) / AgeEnd;

    AgeText = "\n  " + (Age + AgeNow).toFixed(12);
  }

  text(YearNow + AgeText, width / 2, height / 2);
}
