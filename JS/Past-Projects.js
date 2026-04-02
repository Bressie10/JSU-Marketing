const boxes = document.getElementsByClassName("hidden");
const viewMore = document.getElementById("viewMore");
const viewLess = document.getElementById("viewLess");

viewMore.onclick = function () {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.display = "flex"; 
  }
  viewMore.style.display = "none";
  viewLess.style.display = "block";
};

viewLess.onclick = function () {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.display = "none"; 
  }
  viewMore.style.display = "block";
  viewLess.style.display = "none";
};