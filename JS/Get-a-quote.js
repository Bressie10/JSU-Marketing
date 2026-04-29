const socialTiers = {
    Starter: [
        "3 posts/week",
        "1 platform (Facebook or Instagram)",
        "Caption writing & scheduling",
        "Monthly analytics report"
    ],
    Growth: [
        "5 posts/week",
        "2 platforms (Facebook + Instagram)",
        "Story content (2×/week)",
        "Hashtag research",
        "Bi-weekly analytics report"
    ],
    Pro: [
        "Daily posts",
        "3 platforms (Facebook, Instagram, TikTok)",
        "Reels & short-form video",
        "Full content calendar",
        "Community management",
        "Weekly analytics report"
    ],
    Scale: [
        "Full multi-platform content calendar",
        "All major platforms",
        "Paid ad management",
        "Dedicated content strategist",
        "Weekly performance review"
    ]
};

const websitePackages = {
    "Restaurant/Cafe": {
        Starter: ["Homepage", "Menu page", "Contact & location page", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Menu page", "Online reservation form", "Gallery", "About page", "Contact & location page", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Online booking system", "Full menu with categories", "Staff profiles", "Gallery", "Blog/news section", "Contact & location page", "SEO setup", "Speed optimised", "Mobile optimised"],
        Scale: ["Homepage", "Online booking system", "Multiple location pages", "Full menu per location", "Franchise contact directories", "Staff profiles", "Gallery", "Blog/news section", "SEO setup", "Speed optimised", "Mobile optimised"]
    },
    "Landscaping": {
        Starter: ["Homepage", "Services list", "Photo gallery", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Project portfolio", "About page", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Project portfolio", "Online booking system", "Client accounts", "Testimonials section", "About page", "Blog", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Project portfolio", "Online booking system", "Client accounts", "Multiple location pages", "Branch contact directories", "Testimonials", "Blog", "SEO setup", "Mobile optimised"]
    },
    "Retail": {
        Starter: ["Landing page", "Product showcase", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Landing page", "Product categories", "Shopping cart", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Landing page", "Full e-commerce store", "Product categories", "Brand & supplier pages", "Advanced filtering", "Shopping cart", "Analytics dashboard", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Landing page", "Full e-commerce store", "Multi-store location pages", "Product categories", "Brand & supplier pages", "Advanced filtering", "Franchise directory", "Analytics dashboard", "Admin panel", "SEO setup", "Mobile optimised"]
    },
    "Plant and Tool Hire": {
        Starter: ["Homepage", "Product catalogue", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Categorised product catalogue", "Pricing page", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Categorised product catalogue", "Online hire request form", "Product search", "Availability calendar", "Pricing page", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Multi-location inventory", "Online hire store", "Product search", "Availability calendar", "Fleet management info", "Branch directories", "Pricing page", "SEO setup", "Mobile optimised"]
    },
    "Hairdresser & Beautician": {
        Starter: ["Homepage", "Services & pricing list", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services & pricing list", "Online booking system", "Team profiles", "Gallery", "About page", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services & pricing list", "Online booking system", "Client accounts", "Team profiles", "Gallery", "Loyalty program page", "Blog", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services & pricing list", "Online booking system", "Multiple location pages", "Per-branch booking", "Client accounts", "Full team directory", "Gallery", "Blog", "SEO setup", "Mobile optimised"]
    },
    "Mechanic": {
        Starter: ["Homepage", "Services list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Price guide", "About page", "Gallery", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Customer portal (job status tracking)", "Online booking system", "Price guide", "Testimonials", "About page", "Gallery", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Customer portals per branch", "Online booking system", "Multiple location pages", "Fleet management info", "Price guide", "Testimonials", "SEO setup", "Mobile optimised"]
    },
    "Dentistry": {
        Starter: ["Homepage", "Services list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Team profiles", "About page", "Patient FAQ", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Online booking system", "Patient portal", "Team profiles", "Before & after gallery", "Patient FAQ", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Online booking system", "Multiple location pages", "Per-branch booking", "Full team directory", "Patient portal", "Patient resources hub", "Before & after gallery", "SEO setup", "Mobile optimised"]
    },
    "Gym & Fitness": {
        Starter: ["Homepage", "Class timetable", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Class timetable", "Membership info page", "Team/trainer profiles", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Class timetable", "Online membership sign-up", "Trainer profiles", "Gallery", "Blog/tips section", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Class timetable", "Online membership portal", "Multiple location pages", "Trainer profiles", "Gallery", "Blog/tips section", "SEO setup", "Mobile optimised"]
    },
    "Accountancy & Finance": {
        Starter: ["Homepage", "Services list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "About page", "Team profiles", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Client portal", "Team profiles", "Resources/guides section", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Client portal", "Multiple office location pages", "Team directory", "Resources/guides section", "About page", "SEO setup", "Mobile optimised"]
    },
    "Real Estate": {
        Starter: ["Homepage", "Property listings page", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Property listings with filters", "About page", "Team profiles", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Advanced property search", "Individual property pages", "Team profiles", "Valuation request form", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Advanced property search", "Individual property pages", "Multiple office pages", "Full team directory", "Valuation request form", "Market reports section", "SEO setup", "Mobile optimised"]
    },
    "Construction": {
        Starter: ["Homepage", "Services list", "Project gallery", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Project portfolio", "About page", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Project portfolio", "Quote request form", "Team profiles", "Testimonials", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Project portfolio", "Quote request form", "Multiple location pages", "Team directory", "Testimonials", "Health & safety info", "SEO setup", "Mobile optimised"]
    },
    "Photography & Videography": {
        Starter: ["Homepage", "Portfolio gallery", "Services & pricing", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Portfolio gallery", "Services & pricing", "About page", "Client testimonials", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Portfolio gallery", "Services & pricing", "Online booking system", "Client proofing gallery", "About page", "Testimonials", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Portfolio gallery", "Services & pricing", "Online booking system", "Client proofing portal", "Team profiles", "Multiple studio/location pages", "Testimonials", "SEO setup", "Mobile optimised"]
    },
    "Legal Services": {
        Starter: ["Homepage", "Practice areas list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Practice areas list", "Team profiles", "About page", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Practice areas list", "Team profiles", "Client resources section", "Case results/testimonials", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Practice areas list", "Full team directory", "Client portal", "Multiple office pages", "Resources section", "Case results", "About page", "SEO setup", "Mobile optimised"]
    },
    "Cleaning Services": {
        Starter: ["Homepage", "Services list", "Contact & quote form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "About page", "Testimonials", "Contact & quote form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Online booking system", "Testimonials", "Before & after gallery", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Online booking system", "Multiple location/franchise pages", "Testimonials", "Before & after gallery", "About page", "SEO setup", "Mobile optimised"]
    },
    "Childcare & Creche": {
        Starter: ["Homepage", "Services & age groups", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services & age groups", "Staff profiles", "About page", "Parent FAQ", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services & age groups", "Staff profiles", "Parent portal", "Gallery", "Parent FAQ", "About page", "Contact form", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services & age groups", "Staff profiles", "Parent portal", "Multiple creche location pages", "Gallery", "Parent FAQ", "About page", "SEO setup", "Mobile optimised"]
    },
    "Hotel & Accommodation": {
        Starter: ["Homepage", "Rooms overview", "Contact & location", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Rooms & rates page", "Gallery", "About page", "Contact & booking enquiry form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Rooms & rates page", "Online booking system", "Gallery", "Dining/amenities pages", "About page", "SEO setup", "Speed optimised", "Mobile optimised"],
        Scale: ["Homepage", "Online booking system", "Multiple property pages", "Rooms & rates per property", "Gallery", "Dining/amenities pages", "Events/weddings page", "SEO setup", "Speed optimised", "Mobile optimised"]
    },
    "Veterinary": {
        Starter: ["Homepage", "Services list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Team profiles", "About page", "Patient FAQ", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Online appointment booking", "Team profiles", "Pet health resources", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Online appointment booking", "Multiple clinic pages", "Team directory", "Pet health resources", "About page", "SEO setup", "Mobile optimised"]
    },
    "Pharmacy": {
        Starter: ["Homepage", "Services list", "Contact form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Health advice section", "About page", "Contact form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Online prescription request", "Health advice section", "Team profiles", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Online prescription request", "Multiple branch pages", "Health advice section", "Team profiles", "About page", "SEO setup", "Mobile optimised"]
    },
    "Event Planning": {
        Starter: ["Homepage", "Services list", "Portfolio/past events gallery", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "Portfolio gallery", "Testimonials", "About page", "Contact & enquiry form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Portfolio gallery", "Online enquiry & quote form", "Testimonials", "Vendor/partner info", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Portfolio gallery", "Online enquiry & quote form", "Multiple event type pages", "Testimonials", "Vendor directory", "About page", "SEO setup", "Mobile optimised"]
    },
    "Personal Training": {
        Starter: ["Homepage", "Services & pricing", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services & pricing", "About page", "Transformation gallery", "Testimonials", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services & pricing", "Online booking system", "Transformation gallery", "Client testimonials", "Blog/tips section", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services & pricing", "Online booking system", "Client portal", "Transformation gallery", "Blog/tips section", "Multiple trainer profiles", "Testimonials", "SEO setup", "Mobile optimised"]
    },
    "Trades (Plumber/Electrician)": {
        Starter: ["Homepage", "Services list", "Contact & call-out form", "Google Maps embed", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "About page", "Testimonials", "Contact & call-out form", "Google Maps embed", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Online booking/quote form", "Testimonials", "Gallery", "Accreditations page", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Online booking/quote form", "Multiple location pages", "Testimonials", "Gallery", "Accreditations page", "About page", "SEO setup", "Mobile optimised"]
    },
    "IT Services": {
        Starter: ["Homepage", "Services list", "Contact form", "Mobile optimised"],
        Growth: ["Homepage", "Services list", "About page", "Case studies", "Contact form", "SEO setup", "Mobile optimised"],
        Pro: ["Homepage", "Services list", "Client portal", "Case studies", "Team profiles", "Blog/resources section", "About page", "SEO setup", "Mobile optimised"],
        Scale: ["Homepage", "Services list", "Client portal", "Multiple office pages", "Case studies", "Team directory", "Blog/resources section", "About page", "SEO setup", "Mobile optimised"]
    }
};

const sizeToPackage = {
    Small: "Starter",
    Medium: "Growth",
    Large: "Pro",
    Franchise: "Scale"
};

if (!window.supabaseClient) {
    window.supabaseClient = supabase.createClient(
        "https://zluprfqjvlelcvoeqpnx.supabase.co",
        "sb_publishable_0ldJX2nH9zngplwZKU6AKQ_pobyL6sI"
    );
}

const businessOptions = document.getElementById("businessOptions");
const BusinessTypeBtn = document.getElementById("BusinessTypeBtn");
const businessSizeLabel = document.getElementById("businessSizeLabel");
const businessName = document.getElementById("businessName");
const businessTypesForm = document.getElementById("businessTypesForm");
const businessSizeForm = document.getElementById("businessSizeForm");
const buisnessSizeOptions = document.getElementById("buisnessSizeOptions");
const BusinessSizeBtn = document.getElementById("BusinessSizeBtn");
const priceBox = document.getElementById("priceBox");
const packageNameEl = document.getElementById("packageName");
const websiteFeaturesList = document.getElementById("websiteFeatures");
const socialFeaturesList = document.getElementById("socialFeatures");
const inquireBtn = document.getElementById("inquireBtn");
const leadName = document.getElementById("leadName");
const leadEmail = document.getElementById("leadEmail");
const leadStatus = document.getElementById("leadStatus");

BusinessTypeBtn.addEventListener("click", () => {
    if (!businessName.value.trim()) {
        businessName.focus();
        return;
    }
    businessTypesForm.style.display = "none";
    businessSizeForm.style.display = "flex";
    businessSizeLabel.textContent = `How big is ${businessName.value}?`;
});

BusinessSizeBtn.addEventListener("click", () => {
    const selectedSize = buisnessSizeOptions.value;
    const selectedBusiness = businessOptions.value;
    const pkg = sizeToPackage[selectedSize];

    if (!pkg || !websitePackages[selectedBusiness]) return;

    packageNameEl.textContent = `${pkg} Package`;

    websiteFeaturesList.innerHTML = "";
    websitePackages[selectedBusiness][pkg].forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        websiteFeaturesList.appendChild(li);
    });

    socialFeaturesList.innerHTML = "";
    socialTiers[pkg].forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        socialFeaturesList.appendChild(li);
    });

    businessSizeForm.style.display = "none";
    priceBox.style.display = "flex";
});

function showLeadError(msg) {
    leadStatus.textContent = msg;
    leadStatus.className = "lead-error";
}

inquireBtn.addEventListener("click", async () => {
    const name = leadName.value.trim();
    const email = leadEmail.value.trim();

    if (!name) {
        showLeadError("Please enter your name.");
        leadName.focus();
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showLeadError("Please enter a valid email address.");
        leadEmail.focus();
        return;
    }

    inquireBtn.disabled = true;
    inquireBtn.textContent = "Sending...";
    leadStatus.textContent = "";
    leadStatus.className = "";

    const websiteFeats = Array.from(websiteFeaturesList.querySelectorAll("li")).map(li => li.textContent);
    const socialFeats = Array.from(socialFeaturesList.querySelectorAll("li")).map(li => li.textContent);
    const pkgName = packageNameEl.textContent;
    const bizName = businessName.value.trim();
    const bizType = businessOptions.value;
    const bizSize = buisnessSizeOptions.value;

    try {
        const { error: dbError } = await window.supabaseClient
            .from("leads")
            .insert({
                name,
                email,
                business_name: bizName,
                business_type: bizType,
                business_size: bizSize,
                package_name: pkgName,
                website_features: websiteFeats,
                social_features: socialFeats
            });

        if (dbError) {
            showLeadError("Something went wrong saving your details. Please try again.");
            inquireBtn.disabled = false;
            inquireBtn.textContent = "Get My Quote";
            return;
        }

        try {
            const formBody = new URLSearchParams({
                form_type: "quote_lead",
                name,
                email,
                business_name: bizName,
                business_type: bizType,
                business_size: bizSize,
                package_name: pkgName,
                website_features: JSON.stringify(websiteFeats),
                social_features: JSON.stringify(socialFeats)
            });
            const phpRes = await fetch("/FormReplies.php", { method: "POST", body: formBody });
            const phpText = await phpRes.text();
            console.log("[quote_lead] PHP status:", phpRes.status, "response:", phpText);
        } catch (e) {
            console.warn("[quote_lead] fetch error:", e);
        }

        leadStatus.textContent = "Thanks! Check your inbox for your package details — we'll be in touch shortly.";
        leadStatus.className = "lead-success";
        inquireBtn.textContent = "Sent!";
    } catch (e) {
        showLeadError("Something went wrong. Please try again.");
        inquireBtn.disabled = false;
        inquireBtn.textContent = "Get My Quote";
    }
});
