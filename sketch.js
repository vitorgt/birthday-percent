function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(102, 255, 102);
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);
}

function draw() {
  background(0);

  // month is 0-indexed
  // day is 1-indexed

  const y = 1997;
  const m = 10; // month is 0-indexed
  const d = 7; // day is 1-indexed
  const h = 17;
  const i = 11;

  var Now = new Date();

  const YearStart = new Date(year(), 0);
  const YearEnd = new Date(year() + 1, 0) - YearStart;
  var YearNow = (year() + (Now - YearStart) / YearEnd).toFixed(12);

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