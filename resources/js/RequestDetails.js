$(document).ready(async function () {
    const vehicleId = getParameterByName('id');
    if (!vehicleId) {
        alert('No Vehicle ID provided. Please check the URL and try again.');
        return;
    }

    try {
        const vehicle = await fetchVehicleDetails(vehicleId);
        renderVehicle(vehicle);
    } catch (error) {
        console.error('Error loading vehicle:', error);
        alert('An error occurred while loading the vehicle. Please try again later.');
    }
});

let currentVehicleData = null;

function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || null;
}

async function fetchVehicleDetails(vehicleId) {
    const vehicle = await fetchVehicles();
    if (!vehicle) throw new Error('Vehicle not found');

    currentVehicleData = vehicle;
    return vehicle.find(v => v.id === vehicleId);
}

async function fetchVehicles() {
    try {
        const data = await $.getJSON("../../../resources/json/vehicles.json");
        return data.map(vehicle => ({
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price,
            images: vehicle.images || [],
            availableColors: vehicle.availableColors.map(color => ({
                name: color.name, hexCode: color.hexCode
            })),
            upgradeOptions: {
                interiorUpgrades: vehicle.upgradeOptions?.interior || [],
                performanceUpgrades: vehicle.upgradeOptions?.performance || [],
                technologyUpgrades: vehicle.upgradeOptions?.technology || []
            },
            insurancePlans: vehicle.insurancePlans.map(option => ({
                planName: option.planName, annualPremium: option.annualPremium
            })),
            specifications: {
                engine: vehicle.specifications.engine,
                transmission: vehicle.specifications.transmission,
                mileage: vehicle.specifications.mileage,
                safetyRating: vehicle.specifications.safetyRating || null,
                warrantyYears: vehicle.specifications.warrantyYears || null
            }
        }));
    } catch (error) {
        console.error("Error fetching vehicles:", error);
    }
}

function renderVehicle(vehicle) {
    document.title = `Vehicle - ${vehicle.make} ${vehicle.model}`;
    const container = $('#VehicleContainer').empty(); // Clear previous content

    const mainDiv = $('<div>', {class: 'bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto mt-8 p-6'});
    const mdFlexDiv = $('<div>', {class: 'md:flex'});

    mdFlexDiv.append(createImageSlider(vehicle.images));
    mdFlexDiv.append(createInfoSection(vehicle));

    mainDiv.append(mdFlexDiv);
    container.append(mainDiv);
}

function createImageSlider(images) {
    const imgSection = $('<div>', {class: 'md:w-1/2 relative'});

    const sliderContainer = $('<div>', {class: 'image-slider relative'});

    const prevButton = $('<button>', {
        class: 'prev absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 focus:outline-none',
        html: '&lt;'
    });

    const nextButton = $('<button>', {
        class: 'next absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 focus:outline-none',
        html: '&gt;'
    });

    const slidesContainer = $('<div>', {class: 'slides'});

    const fallbackImageUrl = '../../../resources/image/car/fallback.jpg';

    images.forEach((url, index) => {
        $('<img>', {
            src: url, alt: "Vehicle Image", class: `slide${index === 0 ? '' : ' hidden'}`, error() {
                $(this).attr('src', fallbackImageUrl);
            }
        }).appendTo(slidesContainer);
    });

    sliderContainer.append(prevButton, slidesContainer, nextButton);
    imgSection.append(sliderContainer);

    return imgSection;
}

function createInfoSection(vehicle) {
    const infoSection = $('<div>', {class: 'md:w-1/2 p-6 flex flex-col justify-between'});

    infoSection.append($('<h1>', {
        class: 'text-3xl font-bold text-gray-900 dark:text-white mb-4', text: `${vehicle.make} ${vehicle.model}`
    }));

    infoSection.append(createDetailParagraph('Model Code:', vehicle.modelCode));

    infoSection.append(createDetailParagraph('Manufacturing Year:', vehicle.manufacturingYear));

    infoSection.append(createDetailParagraph('Car Type:', vehicle.carType));

    infoSection.append(createDetailParagraph('Fuel Type:', vehicle.fuelType));

    infoSection.append(createDetailParagraph('Year:', vehicle.year));

    // Price Section
    const priceDiv = $('<div>', {class: 'flex items-center mb-4'});

    priceDiv.append($('<span>', {class: 'text-blue600 dark:text-blue400', text: 'Price:'}));

    priceDiv.append($('<span>', {
        id: 'VehiclePrice',
        style: "font-weight:bold; font-size:1.5rem; color:#007BFF;",
        class: 'text-xl font-bold text-blue600 dark:text-blue400 ml2',
        text: `$${vehicle.price}`
    }));

    infoSection.append(priceDiv);

    // Customization Options Section
    infoSection.append(createCustomizationOptions(vehicle));

    // Insurance Plans Section
    infoSection.append(createInsurancePlans(vehicle.insurancePlans));

    return infoSection;
}

function createDetailParagraph(label, value) {
    return $('<p>', {
        class: 'text-sm text-gray600 dark:text-gray400 mb-4',
        html: `<span class='font-semibold'>${label}</span> ${value}`
    });
}

function createCustomizationOptions(vehicle) {
    const customizationDiv = $('<div>', {class: 'mb-4'});

    customizationDiv.append($('<label>', {text: "Select Color:", style: "display:block; margin-bottom:8px;"}));

    const colorOptionsDiv = $('<div>', {class: "flex space-x-3 mt-2"});

    vehicle.availableColors.forEach(color => {
        colorOptionsDiv.append(createColorOption(color));
    });

    customizationDiv.append(colorOptionsDiv);

    // Add upgrade options (interior, performance, technology)
    ['interiorUpgrades', 'performanceUpgrades', 'technologyUpgrades'].forEach(type => {
        customizationDiv.append($('<label>', {text: `Select ${type.replace(/([A-Z])/g, ' $1')} Upgrade:`}));
        vehicle.upgradeOptions[type].forEach(option => {
            customizationDiv.append(createUpgradeOption(option, type));
        });
    });

    return customizationDiv;
}

function createColorOption(color) {
    const colorOptionDiv = $('<div>').css({display: "inline-block", position: "relative"});

    const radioInput = $('<input>', {
        type: "radio", name: "colorOption", value: color.hexCode, css: {display: "none"}
    });

    const colorDisplay = $('<span>').css({
        display: "inline-block",
        width: "40px",
        height: "40px",
        backgroundColor: color.hexCode,
        borderRadius: "50%",
        border: "2px solid transparent",
        cursor: "pointer",
        transition: "border-color 0.2s"
    });

    colorOptionDiv.append(radioInput, colorDisplay);
    return colorOptionDiv;
}

function createUpgradeOption(option, type) {
    const upgradeOptionDiv = $('<div>').css({display: "flex", alignItems: "center", gap: "8px", padding: "8px"});

    const checkboxInput = $('<input>', {
        type: "checkbox", id: `${type}-${option.name}`, value: `${option.additionalCost}`
    }).change(updateTotalPrice);

    const checkboxLabel = $('<label>').attr('for', `${type}-${option.name}`).text(` ${option.name} (+$${option.additionalCost})`);

    upgradeOptionDiv.append(checkboxInput, checkboxLabel);
    return upgradeOptionDiv;
}

function createInsurancePlans(plans) {
    const insuranceDiv = $('<div>').addClass('mb4');

    insuranceDiv.append($('<h4>').text('Insurance Plans').addClass('font-bold mb2'));

    plans.forEach(plan => {
        insuranceDiv.append($('<div>').append($('<input>', {
            style: "display:inline-block; margin-right:8px;",
            type: "checkbox",
            id: `insurance-${plan.planName}`,
            value: `${plan.annualPremium}`,
            change: updateTotalPrice
        }), $('<label>').attr('for', `insurance-${plan.planName}`).text(`${plan.planName} (+$${plan.annualPremium})`)));
    });

    return insuranceDiv;
}

function updateTotalPrice() {
    try {
        let basePrice = parseFloat($('#VehiclePrice').val());
        if (isNaN(basePrice)) throw new Error('Invalid base price');

        let totalPrice = basePrice;

        $('input[type="checkbox"]:checked').each(function () {
            const price = parseFloat($(this).val());
            if (isNaN(price)) throw new Error(`Invalid value for checkbox with id:${$(this).attr('id')}`);
            totalPrice += price;
        });

        $('#VehiclePrice').text(`$${totalPrice.toFixed(2)}`); // Update displayed price
    } catch (error) {
        console.error('Error updating total price:', error);
        alert('An error occurred while updating the total price. Please try again.');
    }
}

// Function to save current selections to local storage
function saveCurrentSelections() {
    let currentSelections = {};

    $('input[type="checkbox"]').each(function () {
        currentSelections[$(this).attr('id')] = $(this).is(':checked'); // Store checked state
    });

    localStorage.setItem("currentSelections", JSON.stringify(currentSelections)); // Save selections to local storage
}

// Function to initialize selections from local storage on page load
function initializeSelections() {
    let savedSelections = JSON.parse(localStorage.getItem("currentSelections")) || {};

    for (const [key, value] of Object.entries(savedSelections)) {
        $(`#${key}`).prop('checked', value); // Check or uncheck based on saved state
    }

    updateTotalPrice(); // Update total price based on loaded state
}

function addSelectedColor(color) {
    // If other colors are already selected, remove them to avoid duplicates
    $('input[type="radio"][name="colorOption"]:checked').each(function () {
        if ($(this).val() !== color.hexCode) $(this).prop('checked', false);
    });

    // Add this color to the list of selected colors
    $('#selectedColors').append(`<span class="color-option" style="background-color:${color.hexCode};"></span>`);
}

// Call initializeSelections on page load to set up initial checkbox states and prices.
$(document).ready(initializeSelections);

// Add to Wishlist function
function addToWishlist(vehicle) {
    let wishlistItems = JSON.parse(localStorage.getItem("LMC_WishList")) || [];
    wishlistItems.push(vehicle);
    localStorage.setItem("LMC_WishList", JSON.stringify(wishlistItems));
    alert(`${vehicle.make} ${vehicle.model} has been added to your wishlist!`);
}

// Buy Now function
function buyNow() {
    alert("Buy Now clicked!");
}
