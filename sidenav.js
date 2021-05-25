/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px"
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0"
}

/* Reset localStorage and reload page */
function resetReload() {
  localStorage.clear()
  location.reload()
}
