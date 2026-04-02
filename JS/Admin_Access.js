
const mobileRadio = document.getElementById("mobile");
const desktopRadio = document.getElementById("desktop");
const submitBtn = document.getElementById("submitBtn");

const mobileContainer = document.getElementById("mobileContainer1");
const desktopContainer = document.getElementById("desktopContainer1");
const errorMessage = document.getElementById("errorMessage")

submitBtn.onclick = function () {
    if (mobileRadio.checked) {
        mobileContainer.style.display = "block";
        desktopContainer.style.display = "none";
    } 
    else if (desktopRadio.checked) {
        desktopContainer.style.display = "block";
        mobileContainer.style.display = "none";
    } 
    else {
        errorMessage.textContent = "*Please select a view*"
    }
};

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
});
