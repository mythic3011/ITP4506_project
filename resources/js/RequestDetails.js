$(document).ready(async function () {
    const vehicleId = getParameterByName('id');
    if (!vehicleId) {
        alert('No Vehicle ID provided. Please check the URL and try again.');
        return;
    }
    try {
        const vehicle = await fetchVehicleDetail(vehicleId);
        renderVehicle(vehicle);
    } catch (error) {
        console.error('Error loading vehicle:', error);
        alert('An error occurred while loading the vehicle. Please try again later.');
    }
});

function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || null;
}

let CurrentVehicleData = null;

async function fetchVehicleDetail(vehicleId) {
    let vehicles = await fetchVehicles();
    let vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
    CurrentVehicleData = vehicle;
    if (!vehicle) throw new Error('Vehicle not found');

    return vehicle;
}

async function fetchVehicles() {
    try {
        const data = await $.getJSON("../../../resources/json/vehicles.json");
        return data.map(vehicle => ({
            id: vehicle.id,
            make: vehicle.make || 'Unknown',
            model: vehicle.model || 'Unknown',
            modelCode: vehicle.modelCode || 'N/A',
            manufacturingYear: vehicle.manufacturingYear || 'N/A',
            carType: vehicle.carType || 'N/A',
            fuelType: vehicle.fuelType || 'N/A',
            year: vehicle.year || 'N/A',
            price: vehicle.price || 0,
            images: vehicle.images || [],
            availableColors: Array.isArray(vehicle.availableColors) ? vehicle.availableColors.map(color => ({
                name: color.name, hexCode: color.hexCode
            })) : [],
            upgradeOptions: {
                interiorUpgrades: Array.isArray(vehicle.upgradeOptions?.interiorUpgrades) ? vehicle.upgradeOptions.interiorUpgrades : [],
                performanceUpgrades: Array.isArray(vehicle.upgradeOptions?.performanceUpgrades) ? vehicle.upgradeOptions.performanceUpgrades : [],
                technologyUpgrades: Array.isArray(vehicle.upgradeOptions?.technologyUpgrades) ? vehicle.upgradeOptions.technologyUpgrades : []
            },
            insurancePlans: Array.isArray(vehicle.insurancePlans) ? vehicle.insurancePlans.map(option => ({
                planName: option.planName,
                annualPremium: option.annualPremium,
                coverageLimit: option.coverageLimit || null,
                deductible: option.deductible || null
            })) : [],
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
        return []; // Return an empty array on error to prevent further issues
    }
}

function renderVehicle(vehicle) {
    if (!vehicle) {
        console.error('No vehicle data available to render.');
        return;
    }

    const make = vehicle.make || 'Unknown';
    const model = vehicle.model || 'Unknown';

    document.title = `Vehicle - ${make} ${model}`;

    const container = $('#VehicleContainer').empty(); // Clear previous content
    const mainDiv = $('<div>', {class: 'bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto mt-8 p-6'});

    const mdFlexDiv = $('<div>', {class: 'md:flex'});

    // Check if images exists and is an array
    const imageUrls = Array.isArray(vehicle.images) ? vehicle.images.map(image => image.url) : [];

    // Pass the extracted URLs to createImageSlider
    mdFlexDiv.append(createImageSlider(imageUrls));

    // Info Section
    mdFlexDiv.append(createInfoSection(vehicle));
    mainDiv.append(mdFlexDiv);

    const ButtonContainer = $('<div>', {class: 'flex justify-center mt-8 gap-4'});
    const backButton = $('<button>', {
        class: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600', text: 'Back'
    });
    const wishlistButton = $('<button>', {
        class: 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600',
        text: 'Add to Wishlist',
        id: "addToWishlist-button"
    });
    ButtonContainer.append(backButton, wishlistButton);
    mainDiv.append(ButtonContainer);
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

    if (Array.isArray(images)) {
        images.forEach((url, index) => {
            console.log(url);
            const img = $('<img>', {
                src: url, alt: "Vehicle Image", class: `slide${index === 0 ? '' : ' hidden'}`, width: 750, height: 500
            }).on('error', function () {
                $(this).attr('src', fallbackImageUrl);
            });
            slidesContainer.append(img);
        });
    } else {
        console.error('Images is not an array:', images);
    }

    sliderContainer.append(prevButton, slidesContainer, nextButton);
    imgSection.append(sliderContainer);

    return imgSection;
}

function createInfoSection(vehicle) {
    const infoSection = $('<div>', {class: 'md:w-1/2 p-6 flex flex-col justify-between'});

    infoSection.append($('<h1>', {
        class: 'text-3xl font-bold text-gray-900 dark:text-white mb-4', text: `${vehicle.make} ${vehicle.model}`
    }));

    infoSection.append(createDetailParagraph('Model Code:', vehicle.modelCode || 'N/A'));

    infoSection.append(createDetailParagraph('Manufacturing Year:', vehicle.manufacturingYear || 'N/A'));

    infoSection.append(createDetailParagraph('Car Type:', vehicle.carType || 'N/A'));

    infoSection.append(createDetailParagraph('Fuel Type:', vehicle.fuelType || 'N/A'));

    infoSection.append(createDetailParagraph('Year:', vehicle.year || 'N/A'));

    // Price Section
    const priceDiv = $('<div>', {class: 'flex items-center mb-4'});

    priceDiv.append($('<span>', {class: 'text-blue-600 dark:text-blue400', text: 'Price:'}));

    priceDiv.append($('<span>', {
        id: 'VehiclePrice',
        style: "font-weight:bold; font-size:1.5rem; color:#007BFF;",
        class: 'text-xl font-bold text-blue600 dark:text-blue400 ml2',
        text: `$${vehicle.price || 0}`
    }));

    infoSection.append(priceDiv);

    // Customization Options Section
    infoSection.append(createCustomizationOptions(vehicle));

    // Insurance Plans Section
    if (Array.isArray(vehicle.insurancePlans)) {
        infoSection.append(createInsurancePlans(vehicle.insurancePlans));
    } else {
        console.warn('No insurance plans found for this vehicle.');
        infoSection.append($('<div>', {text: 'No insurance plans available.', class: 'text-red-500'}));
    }

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

    // Section header for color selection
    customizationDiv.append($('<h3>', {
        text: "Select Color:",
        class: 'text-lg font-medium text-gray-900 dark:text-white mb-2',
        id: "CustomizationHeader"
    }));

    const colorOptionsDiv = $('<div>', {class: "flex flex-wrap space-x-3 mt-2", id: 'ColorOptions'});

    // Check if availableColors exists and is an array
    if (Array.isArray(vehicle.availableColors)) {
        vehicle.availableColors.forEach(color => {
            colorOptionsDiv.append(createColorOption(color));
        });
    } else {
        colorOptionsDiv.append($('<p>', {text: 'No colors available.', class: 'text-red-500'}));
        console.warn('No available colors found for this vehicle.');
    }

    customizationDiv.append(colorOptionsDiv);
    customizationDiv.append($('<div>', {id: 'customization'}));

    // Section header for upgrade options
    ['interiorUpgrades', 'performanceUpgrades', 'technologyUpgrades'].forEach(type => {
        const upgradeSection = $('<div>', {class: 'mb-4', id: `upgrades-${type}`});
        upgradeSection.append($('<h3>', {
            text: `Select ${type.replace(/([A-Z])/g, ' $1')}:`,
            class: 'text-lg font-medium text-gray-900 dark:text-white mb-2'
        }));

        const optionsDiv = $('<div>', {class: 'flex flex-col space-y-2', id: `upgrades-${type}-options`});

        // Check if upgrade options exist and are arrays
        const options = vehicle.upgradeOptions?.[type];
        if (Array.isArray(options)) {
            options.forEach(option => {
                optionsDiv.append(createUpgradeOption(option, type));
            });
        } else {
            optionsDiv.append($('<p>', {text: 'No upgrades available.', class: 'text-red-500'}));
            console.warn(`No upgrades found for ${type}.`);
        }

        upgradeSection.append(optionsDiv);
        customizationDiv.append(upgradeSection);
        customizationDiv.append($('</div>'));
    });


    // Add a cancel button to reset selections
    const cancelButton = $('<button>', {
        text: 'Cancel Selections',
        class: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mt-4',
        click: CancelSelections
    });

    customizationDiv.append(cancelButton);

    return customizationDiv;
}


function CancelSelections() {
    // Clear previously selected colors
    $('input[type="radio"][name="colorOption"]:checked').each(function () {
        $(this).prop('checked', false);
    });

    // Clear previously selected upgrades
    $('input[type="checkbox"][name="interior"]:checked').each(function () {
        $(this).prop('checked', false);
    });
    $('input[type="checkbox"][name="performanceUpgrades"]:checked').each(function () {
        $(this).prop('checked', false);
    });
    $('input[type="checkbox"][name="technologyUpgrades"]:checked').each(function () {
        $(this).prop('checked', false);
    });
}


function createColorOption(color) {
    const colorOptionDiv = $('<div>').css({
        display: "inline-block", position: "relative", margin: "10px", cursor: "pointer", transition: "transform 0.2s"
    });

    const radioInput = $('<input>', {
        type: "radio", name: "colorOption", id: `colorOption-${color.name}`, value: color.name, change: function () {
            addSelectedColor(this.value);
        },
    });

    const colorDisplay = $('<span>').css({
        display: "inline-block",
        width: "60px", // Increased size for better visibility
        height: "60px",
        backgroundColor: color.hexCode,
        borderRadius: "50%",
        border: "2px solid transparent",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "cursor"
    })
        .attr('title', color.name)
    colorOptionDiv.append(radioInput, colorDisplay);

    return colorOptionDiv;
}


function addSelectedColor(color) {
    // Clear previously selected colors
    $('input[type="radio"][name="colorOption"]:checked').each(function () {
        if ($(this).val() !== color) $(this).prop('checked', false);
    });

    // Update selected colors display
    $('#selectedColors').empty().append(`<span class="color-option" style="background-color:${color}; width: 20px; height: 20px; display:inline-block; border-radius: 50%; margin-right: 5px;"></span>`);
    $('#ColorLabel').text(`Selected Color: ${color}`);
}

function createUpgradeOption(option, type) {
    const upgradeOptionDiv = $('<div>').css({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        borderRadius: "8px",
        borderWidth: "1px",
        borderColor: "#e5e7eb",
        borderStyle: "solid",
        transition: "background-color 0.2s"
    }).hover(function () {
        $(this).css('background-color', '#f3f4f6');
    }, function () {
        $(this).css('background-color', ''); // Reset on mouse leave
    });

    const checkboxInput = $('<input>', {
        type: "checkbox", id: `${option.name}`, value: `${option.additionalCost}`
    }).change(updateTotalPrice);

    const checkboxLabel = $('<label>').attr('for', `${type}-${option.name}`).text(` ${option.name} (+$${option.additionalCost})`);

    upgradeOptionDiv.append(checkboxInput, checkboxLabel);
    return upgradeOptionDiv;
}

function createInsurancePlans(plans) {
    console.log('Creating insurance plans:', plans);

    const insuranceDiv = $('<div>').addClass('mb4');

    insuranceDiv.append($('<h4>').text('Insurance Plans').addClass('font-bold mb2'));

    plans.forEach(plan => {
        insuranceDiv.append($('<div>').append($('<input>', {
            style: "display:inline-block; margin-right:8px;",
            type: "checkbox",
            id: `insurance-${plan.planName}`,
            value: `${plan.annualPremium}`,
            change: updateTotalPrice,
        }), $('<label>').attr('for', `insurance-${plan.planName}`).text(`${plan.planName} (+$${plan.annualPremium})`)));
    });

    return insuranceDiv;
}

function updateTotalPrice() {
    try {
        let basePrice = parseFloat(CurrentVehicleData.price);

        let totalPrice = basePrice;

        $('input[type="checkbox"]:checked').each(function () {
            const price = parseFloat($(this).val());
            totalPrice += price;
        });

        $('#VehiclePrice').text(`$${totalPrice.toFixed(2)}`); // Update displayed price

    } catch (error) {
        console.error('Error updating total price:', error);
    }
}

function addToWishlist(vehicle) {
    // Retrieve existing wishlist from local storage or initialize an empty array
    let wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
    console.log(wishlistItems);
    // Check if a color is selected
    const selectedColor = $('input[name="colorOption"]:checked').val();
    if (!selectedColor) {
        alert('Please select a color for your vehicle', 'error');
        return;
    }

    // Check if the vehicle is already in the wishlist
    const existingItem = wishlistItems.find(item => item.id === vehicle.id);
    if (existingItem) {
        alert('This vehicle is already in your wishlist Now help you to redirect to Wishlist page', 'info');
        // set the addToWishlist-button to disabled and set its text to "Added to Wishlist"
        $('#addToWishlist-button').prop('disabled', true);
        $('#addToWishlist-button').text('Added to Wishlist');
        $('#addToWishlist-button').removeClass('bg-green-500');
        $('#addToWishlist-button').addClass('bg-red-500');
    setTimeout(() => {
        window.location.href = './Wishlist.html';
    }, 1000);
        return;
    }

    // Gather selected upgrades (excluding insurance)
    const selectedUpgrades = [];
    $('input[type="checkbox"]:checked').each(function () {
        const id = $(this).attr('id');
        // Only add to upgrades if it does not contain 'insurance-'
        if (!id.startsWith('insurance-')) {
            selectedUpgrades.push(id); // Store the ID or name of the upgrade
        }
    });

    // Gather selected insurance plans separately
    const selectedInsurancePlans = [];
    $('input[type="checkbox"][id^="insurance"]:checked').each(function () {
        selectedInsurancePlans.push({
            planName: $(this).attr('id').replace('insurance-', ''), // Extract plan name
            annualPremium: parseFloat($(this).val()) // Extract premium cost
        });
    });

    // Calculate total price based on upgrades and insurance plans
    let totalPrice = vehicle.price;

    // Add upgrade costs to total price
    selectedUpgrades.forEach(upgradeId => {
        const upgradeCost = parseFloat($(`#${upgradeId}`).val());
        if (!isNaN(upgradeCost)) {
            totalPrice += upgradeCost;
        }
    });

    // Add insurance plan costs to total price
    selectedInsurancePlans.forEach(plan => {
        totalPrice += plan.annualPremium;
    });

    // Create a new wishlist item with selected options
    const wishlistItem = {
        id: vehicle.id, make: vehicle.make, model: vehicle.model, color: selectedColor, upgrades: selectedUpgrades,  // Only upgrades, no insurance here
        insurancePlans: selectedInsurancePlans,  // Separate array for insurance plans
        price: vehicle.price, totalPrice: totalPrice,  // New field for total price
        dateAdded: new Date().toISOString()  // Timestamp for when it was added
    };

    // Add new item to wishlist
    wishlistItems.push(wishlistItem);

    // Save updated wishlist back to local storage
    localStorage.setItem('LMC_WishList', JSON.stringify(wishlistItems));

    alert('Vehicle added to your wishlist!', 'success');

    alert('Redirecting to Wishlist page...', 'info');

    setTimeout(() => {
        window.location.href = './Wishlist.html';
    }, 1000);
}


$(document).on('click', '.bg-green-500', function () {
    addToWishlist(CurrentVehicleData);
});

// Back button onClick event
$(document).on('click', '.bg-blue-500', function () {
    alert('Redirecting to Home page...', 'info');
    window.location.href = './ViewVehicles.html';
});

let notificationTimeout;

function showNotification(message, type = 'info') {
    // Remove existing notification
    $('.notification').remove();
    clearTimeout(notificationTimeout);

    // Create new notification
    const notification = $(`
        <div class="notification ${type} fixed top-[10%] right-[10%] bg-white border-l-[5px] 
        border-${type === 'error' ? 'red' : 'green'}-500 shadow-lg p-4 rounded-lg transition-all duration-300 
        ease-in-out">
            ${message}
        </div>
    `);

    // Add to body
    $('body').append(notification);

    // Animate in
    setTimeout(() => {
        notification.addClass('show');
    }, 100);

    // Auto remove after 3 seconds
    notificationTimeout = setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}