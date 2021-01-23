function automateInput(id, data) {
  let obj = document.getElementById(id);
  if (!localStorage.getItem(id)) {
    localStorage.setItem(id, obj[data]);
  }
  obj[data] = localStorage.getItem(id);
  obj.addEventListener("change", function () {
    localStorage.setItem(id, obj[data]);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  automateInput("ColorBG", "value");
  automateInput("ColorText", "value");
  automateInput("ShowBirthday", "checked");
  automateInput("DateBirthday", "value");
  automateInput("TimeBirthday", "value");
}

function draw() {
  background(localStorage.getItem("ColorBG"));
  noStroke();
  fill(localStorage.getItem("ColorText"));

  document.body.style.backgroundColor = localStorage.getItem("ColorBG");
  document.getElementsByClassName("openbtn")[0].style.color = localStorage.getItem("ColorText");

  let Now = new Date();

  var YearStart = new Date(year(), 0);
  var YearEnd = new Date(year() + 1, 0);
  var YearNow = (year() + (Now - YearStart) / (YearEnd - YearStart)).toFixed(12);

  var AgeText = "";

  if (ShowBirthday) {
    let DateBirthday = localStorage.getItem("DateBirthday").split("-");
    let TimeBirthday = localStorage.getItem("TimeBirthday").split(":");

    var BirthY = DateBirthday[0];
    var BirthMo = DateBirthday[1] - 1; // month is 0-indexed
    var BirthD = DateBirthday[2];
    var BirthH = TimeBirthday[0];
    var BirthMi = TimeBirthday[1];

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
    var AgeNow = (Now - AgeStart) / AgeEnd;

    AgeText = "\n  " + (Age + AgeNow).toFixed(12);
  }

  text(YearNow + AgeText, width / 2, height / 2);
}
