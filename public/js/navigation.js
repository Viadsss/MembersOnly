const menuButton = document.getElementById("menuButton");

menuButton.addEventListener("click", toggleMenu);

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("show");
  menuButton.classList.toggle("change");
}
