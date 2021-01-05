function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(102, 255, 102);
  textAlign(CENTER, CENTER);
  textFont("Courier New", width / 12);

  // month is 0-indexed
  // day is 1-indexed
  oneyear = new Date(Date.UTC(1971, 0));
  s = new Date(year(), 0);
  e = new Date(year() + 1, 0) - s;
  bs = new Date(1997, 10, 7, 17, 11, 0);
}

function draw() {
  background(0);

  n = Date.now() - s;
  bn = Date.now() - bs;

  text(
    (year() + n / e).toFixed(12) + "\n  " +
    (bn / oneyear).toFixed(12),
    width / 2,
    height / 2
  );
}