document.addEventListener("DOMContentLoaded", show)
function show(){
  const name = document.getElementById("nav");
  if (name.className === "navBar") {
    name.className += " responsive";
  } else {
    name.className = "navBar";
  }
}