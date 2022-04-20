let BirthDay = null
let DeathDay = null
let DateBirthday = null
let TimeBirthday = null

let BirthY = null
let BirthMo = null
let BirthD = null
let BirthH = null
let BirthMi = null
let DeathAge = null

const Week = new Date(Date.UTC(1970, 0, 8))
const GridBorder = 25
let LifeWeeks = 0
let r = 0
let c = 0
let BSize = 0

let markers = { birthdays: [] }

function HEXtoRGB(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
  } else {
    return "rgba(" + r + ", " + g + ", " + b + ", 1.0)"
  }
}

function updateDate() {
  DateBirthday = localStorage.getItem("DateBirthday").split("-")
  TimeBirthday = localStorage.getItem("TimeBirthday").split(":")

  BirthY = parseInt(DateBirthday[0])
  BirthMo = parseInt(DateBirthday[1]) - 1 // month is 0-indexed
  BirthD = parseInt(DateBirthday[2])
  BirthH = parseInt(TimeBirthday[0])
  BirthMi = parseInt(TimeBirthday[1])
  DeathAge = parseInt(localStorage.getItem("DeathAge"))

  BirthDay = new Date(BirthY, BirthMo, BirthD, BirthH, BirthMi)
  DeathDay = new Date(
    BirthY + DeathAge,
    BirthMo,
    BirthD,
    BirthH,
    BirthMi,
  )
  LifeWeeks = Math.ceil((DeathDay - BirthDay) / Week)

  if (width / height < 0.6) {
    r = Math.ceil(Math.sqrt(LifeWeeks / (width / height)))
  } else {
    r = Math.round(Math.sqrt(LifeWeeks / (width / height)))
  }
  c = Math.ceil(LifeWeeks / r)

  BSize = Math.min(
    (width - GridBorder * 2) / c,
    (height - GridBorder * 2) / r,
  )
  calculateBirthdays()
}

function calculateBirthdays() {
  markers.birthdays = []
  for (let i = 0; i <= DeathAge; i++) {
    const a =
      (new Date(BirthY + i, BirthMo, BirthD, BirthH, BirthMi) -
        BirthDay) /
      Week
    markers.birthdays.push([a % c, Math.floor(a / c)])
  }
}

function updateColor(space) {
  let col = HEXtoRGB(
    localStorage.getItem(space + "_hex"),
    localStorage.getItem(space + "_alpha") / 100,
  )
  localStorage.setItem(space + "_rgba", col)
}

function automateInput(id, data, CheckboxDateColor) {
  // Checkbox == 1; Date == 2; Color = 3;
  let obj = document.getElementById(id)
  if (!localStorage.getItem(id)) {
    localStorage.setItem(id, obj[data])
  }
  obj[data] = localStorage.getItem(id)

  if (CheckboxDateColor == 1) {
    // Checkbox
    obj.addEventListener("change", function () {
      localStorage.setItem(id, obj[data])
    })
  } else if (CheckboxDateColor == 2) {
    //Date
    obj.addEventListener("change", function () {
      localStorage.setItem(id, obj[data])
      updateDate()
    })
  } else if (CheckboxDateColor == 3) {
    // Color
    obj.addEventListener("change", function () {
      localStorage.setItem(id, obj[data])
      updateColor(id.split("_")[0])
    })
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(Math.max(displayDensity(), 2))
  textAlign(CENTER, CENTER)
  textFont("Courier New", width / 12)

  if (localStorage.getItem("ShowSideBar") == null) {
    localStorage.setItem("ShowSideBar", false) // to close on next page load
  } else if (localStorage.getItem("ShowSideBar") == "false") {
    closeNav()
  }

  automateInput("ShowYear", "checked", 1)
  automateInput("ShowBirthday", "checked", 1)
  automateInput("ShowGrid", "checked", 1)
  automateInput("MarkBirthdays", "checked", 1)

  automateInput("DateBirthday", "value", 2)
  automateInput("TimeBirthday", "value", 2)
  automateInput("DeathAge", "value", 2)

  automateInput("BG_hex", "value", 3)
  automateInput("Text_hex", "value", 3)
  automateInput("Text_alpha", "value", 3)
  automateInput("Grid_hex", "value", 3)
  automateInput("Grid_alpha", "value", 3)
  automateInput("Gone_hex", "value", 3)
  automateInput("Gone_alpha", "value", 3)
  automateInput("Markers_hex", "value", 3)
  automateInput("Markers_alpha", "value", 3)

  updateDate()
  updateColor("BG")
  updateColor("Text")
  updateColor("Grid")
  updateColor("Gone")
  updateColor("Markers")
}

function draw() {
  background(localStorage.getItem("BG_rgba"))

  document.body.style.backgroundColor = localStorage.getItem("BG_rgba")
  document.getElementsByClassName("openbtn")[0].style.color =
    localStorage.getItem("Text_hex")
  document.getElementsByClassName("code")[0].style.color =
    localStorage.getItem("Text_hex")

  let Now = new Date()
  let Weeks = (Now - BirthDay) / Week

  /* Grid */

  if (localStorage.getItem("ShowGrid") == "true") {
    // how much is left by the grid border, to centralize the grid
    const cRest = (width - BSize * c - GridBorder * 2) / 2
    const rRest = (height - BSize * r - GridBorder * 2) / 2

    textSize(GridBorder - 5)
    let HalfGridBorder = (GridBorder + rRest) / 2
    text("Every square is one week of your", width / 2, HalfGridBorder)
    text(
      "life until you're " + DeathAge + " years old.",
      width / 2,
      height - HalfGridBorder,
    )

    // how many complete rows have been lived
    let rComplete = Math.floor(Weeks / c)
    // how many complete columns have been lived, at the incomplete row
    let cComplete = Math.floor(Weeks - rComplete * c)

    noStroke()
    fill(localStorage.getItem("Gone_rgba"))

    // one big rect to fill all complete rows
    rect(
      GridBorder + cRest,
      GridBorder + rRest,
      c * BSize,
      rComplete * BSize,
    )

    // rect to fill columns at the incomplete row
    // + actual week, being completed
    rect(
      GridBorder + cRest,
      rComplete * BSize + GridBorder + rRest,
      cComplete * BSize + BSize * (Weeks % 1),
      BSize,
    )

    strokeWeight(1)
    stroke(localStorage.getItem("Grid_rgba"))
    noFill()

    // how many complete columns have at the incomplete row of LifeWeeks
    cComplete = Math.floor(LifeWeeks - Math.floor(LifeWeeks / c) * c)

    let j = 0
    let i = 0

    // horizontal lines of the grid
    for (j = 0; j < r; j++) {
      line(
        GridBorder + cRest,
        j * BSize + GridBorder + rRest,
        c * BSize + GridBorder + cRest,
        j * BSize + GridBorder + rRest,
      )
    }
    // last, possibly, incomplete horizontal line
    line(
      GridBorder + cRest,
      j * BSize + GridBorder + rRest,
      cComplete * BSize + GridBorder + cRest,
      j * BSize + GridBorder + rRest,
    )

    // if the last row of the grid is incomplete
    if (cComplete > 0) {
      // vertical lines of the grid
      // up to the bottom of the grid
      for (i = 0; i <= cComplete; i++) {
        line(
          i * BSize + GridBorder + cRest,
          GridBorder + rRest,
          i * BSize + GridBorder + cRest,
          r * BSize + GridBorder + rRest,
        )
      }

      // vertical lines of the grid
      // up to the bottom of the grid - 1 (incomplete row)
      for (; i <= c; i++) {
        line(
          i * BSize + GridBorder + cRest,
          GridBorder + rRest,
          i * BSize + GridBorder + cRest,
          (r - 1) * BSize + GridBorder + rRest,
        )
      }
    } else {
      // last horizontal line
      line(
        GridBorder + cRest,
        j * BSize + GridBorder + rRest,
        c * BSize + GridBorder + cRest,
        j * BSize + GridBorder + rRest,
      )

      // vertical lines of the grid
      // up to the bottom of the grid
      for (i = 0; i <= c; i++) {
        line(
          i * BSize + GridBorder + cRest,
          GridBorder + rRest,
          i * BSize + GridBorder + cRest,
          r * BSize + GridBorder + rRest,
        )
      }
    }

    strokeWeight(1)
    stroke(localStorage.getItem("Markers_rgba"))
    noFill()

    if (localStorage.getItem("MarkBirthdays") == "true") {
      for (const [i, j] of markers.birthdays) {
        line(
          GridBorder + cRest + i * BSize,
          GridBorder + rRest + j * BSize,
          GridBorder + cRest + i * BSize,
          GridBorder + rRest + j * BSize + BSize,
        )
      }
    }
  }

  /* Text */

  noStroke()
  fill(localStorage.getItem("Text_rgba"))

  let YearStart = new Date(year(), 0)
  let YearEnd = new Date(year() + 1, 0)
  let YearNow = ""
  let boolYear = false
  if (localStorage.getItem("ShowYear") == "true") {
    boolYear = true
    YearNow = (
      year() +
      (Now - YearStart) / (YearEnd - YearStart)
    ).toFixed(12)
  }

  let BirthComp = new Date(year(), BirthMo, BirthD, BirthH, BirthMi)
  let Age = null
  let AgeStart = null
  let AgeEnd = null

  if (BirthComp <= Now) {
    Age = year() - BirthY - 1
    AgeStart = new Date(year() - 1, BirthMo, BirthD, BirthH, BirthMi)
    AgeEnd =
      new Date(year(), BirthMo, BirthD, BirthH, BirthMi) - AgeStart
  } else {
    Age = year() - BirthY
    AgeStart = new Date(year(), BirthMo, BirthD, BirthH, BirthMi)
    AgeEnd =
      new Date(year() + 1, BirthMo, BirthD, BirthH, BirthMi) - AgeStart
  }
  // document.getElementById("DeathAge").min = Age;
  let AgeNow = (Now - AgeStart) / AgeEnd

  let digits = Math.floor(Math.max(0, Math.log10(Age))) + 1

  let AgeText = ""
  let boolAge = false
  if (localStorage.getItem("ShowBirthday") == "true") {
    boolAge = true
    AgeText = " ".repeat(4 - digits) + (Age + AgeNow).toFixed(12)
  }

  let linefeed = ""
  if (boolYear && boolAge) {
    linefeed = "\n"
  }
  textSize(width / 12)
  text(YearNow + linefeed + AgeText, width / 2, height / 2)
}
