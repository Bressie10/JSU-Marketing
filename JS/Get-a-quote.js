const businessOptions = document.getElementById("businessOptions");
const BusinessTypeBtn = document.getElementById("BusinessTypeBtn");
const businessSizeLabel = document.getElementById("businessSizeLabel");
const businessName = document.getElementById("businessName");

const businessTypesForm = document.getElementById("businessTypesForm");
const businessSizeForm = document.getElementById("businessSizeForm");

BusinessTypeBtn.addEventListener("click", () => {

    var selectedBusiness = businessOptions.value;  
    switch (selectedBusiness) {
        case "Resturant/Cafe":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`

            break;
        case "Landscaping":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`

            break;
        case "Retail":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`

            break;
        case "Plant and Tool Hire":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`
            
            break;
        case "Hairdresser & Beautician":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`
            break;
        case "Mechanic":
            businessTypesForm.style.display = "none"
            businessSizeForm.style.display = "block"
            businessSizeLabel.textContent = `How big is ${businessName.value}?`
            break;
        default:
            businessTypesForm.style.display = "none"
    }
});
const buisnessSizeOptions = document.getElementById("buisnessSizeOptions");
const BusinessSizeBtn = document.getElementById("BusinessSizeBtn");

const priceBoxHeader = document.getElementById("priceBoxHeader")
const priceBox = document.getElementById("priceBox");
const listItem1 = document.getElementById("listItem1");
const listItem2 = document.getElementById("listItem2");


BusinessSizeBtn.addEventListener("click", () => {
    var selectedSize = buisnessSizeOptions.value;  
    switch (selectedSize) {
        case "Small":
            priceBox.style.display = "flex"
            businessSizeForm.style.display = "none"

            break;
        case "Medium":
            priceBox.style.display = "flex"
            businessSizeForm.style.display = "none"

            break;
        case "Large":
            priceBox.style.display = "flex"
            businessSizeForm.style.display = "none"

            break;
        case "Franchise":
            priceBox.style.display = "flex"
            businessSizeForm.style.display = "none"
            priceBoxHeader.textContent = `Test` 
            
            break;
        default:
            businessTypesForm.style.display = "none"
    }
});

BusinessSizeBtn.addEventListener("click", () => {
    const selectedSize = buisnessSizeOptions.value;     
    const selectedBusiness = businessOptions.value;
    
                        //Retail//
if (selectedSize == "Small" && selectedBusiness == "Retail") {
        listItem1.textContent = "A small simple store with landing page";
        listItem2.textContent = "Social Media"
        }

else if (selectedSize == "Medium" && selectedBusiness == "Retail") {
        listItem1.textContent = "A complex store with product categories with a landing page"
        listItem2.textContent = "Social Media"
        } 
    
else if (selectedSize == "Large" && selectedBusiness == "Retail") {
        listItem1.textContent = "A complex store with product categories, Brands and Suppliers with a complex landing page"
        listItem2.textContent = "Social Media"
        } 
    
else if (selectedSize == "Franchise" && selectedBusiness == "Retail") {
        listItem1.textContent = "A complex store with product categories, Brands and Suppliers with a complex landing page along with store locations"
        listItem2.textContent = "Social Media"
        }
                            //Landscaping//
else if (selectedSize == "Small" && selectedBusiness == "Landscaping") {
        listItem1.textContent = "A Simple Landing Page"
        listItem2.textContent = "Social Media"
        }
else if (selectedSize == "Medium" && selectedBusiness == "Landscaping") {
        listItem1.textContent = "A Complex Landing Page"
        listItem2.textContent = "Social Media"
        }
else if (selectedSize == "Large" && selectedBusiness == "Landscaping") {
        listItem1.textContent = "A Complex Landing Page with a booking system and client accounts"
        listItem2.textContent = "Social Media"
        }
else if (selectedSize == "Franchise" && selectedBusiness == "Landscaping") {
        listItem1.textContent = "A Complex Landing Page with a booking system and client accounts and Location and Contact Info or every Branch"
        listItem2.textContent = "Social Media"
        }
                           //Dentistry//
else if (selectedSize == "Small" && selectedBusiness == "Dentistry") {
        listItem1.textContent = "A Simple Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Medium" && selectedBusiness == "Dentistry") {
        listItem1.textContent = "A Complex Landing Page with Team"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Large" && selectedBusiness == "Dentistry") {
        listItem1.textContent = "A Complex Landing Page with Team and Booking System"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Franchise" && selectedBusiness == "Dentistry") {
        listItem1.textContent = "A Complex Landing Page with Team and Booking System and Locations and Contact Info"
        listItem2.textContent = "Social Media"
                    //Cafe/Resturant//
        }
else if (selectedSize == "Small" && selectedBusiness == "Resturant/Cafe") {
        listItem1.textContent = "A Simple Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Medium" && selectedBusiness == "Resturant/Cafe") {
        listItem1.textContent = "A Simple Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Large" && selectedBusiness == "Resturant/Cafe") {
        listItem1.textContent = "A Simple Landing page with booking system"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Franchise" && selectedBusiness == "Resturant/Cafe") {
        listItem1.textContent = "A Simple Landing page with booking system and locations"
        listItem2.textContent = "Social Media"
        }
                       //Tool and Equipment Hire//
else if (selectedSize == "Small" && selectedBusiness == "Plant and Tool Hire") {
        listItem1.textContent = "A complex Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Medium" && selectedBusiness == "Plant and Tool Hire") {
        listItem1.textContent = "A complex Landing page with a product catalogue"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Large" && selectedBusiness == "Plant and Tool Hire") {
        listItem1.textContent = "A complex Landing page with a store"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Franchise" && selectedBusiness == "Plant and Tool Hire") {
        listItem1.textContent = "A complex landing page with online store and locations"
        listItem2.textContent = "Social Media"
        }

                        //Hairdresser & Beautician//
else if (selectedSize == "Small" && selectedBusiness == "Hairdresser & Beautician") {
        listItem1.textContent = " A Simple Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Medium" && selectedBusiness == "Hairdresser & Beautician") {
        listItem1.textContent = "A simple landing page with booking system"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Large" && selectedBusiness == "Hairdresser & Beautician") {
        listItem1.textContent = "A Complex Landing Page with Team and Booking System"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Franchise" && selectedBusiness == "Hairdresser & Beautician") {
        listItem1.textContent = "Complex Landing Page with Team and Booking System and Locations and Contact Info"
        listItem2.textContent = "Social Media"
        }
                        //Mechanic//
else if (selectedSize == "Small" && selectedBusiness == "Mechanic") {
        listItem1.textContent = "A Simple Landing page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Medium" && selectedBusiness == "Mechanic") {
        listItem1.textContent = "A Complex Landing Page"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Large" && selectedBusiness == "Mechanic") {
        listItem1.textContent = "Complex Landing Page with customer portal"
        listItem2.textContent = "Social Media"
        }
else if(selectedSize == "Franchise" && selectedBusiness == "Mechanic") {
        listItem1.textContent = "Complex Landing Page with customer portal and Locations"
        listItem2.textContent = "Social Media"
        }
            });

inquireBtn.onclick = function () {
    const email = "jsumarketingteam@gmail.com";
    const subject = "Business Inquiry";  

    const body = `I would like to inquire about a ${listItem1.textContent} and a ${listItem2.textContent}. Further details include:`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
};

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
});

