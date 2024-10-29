// ViewVehicles.js

const cars = [{
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25999,
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fc?w=500', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?w=500'],
    colors: [{name: 'Blue Flame', hex: '#0072BB'}, {name: 'Plasma Orange', hex: '#FF6F20'}, {
        name: 'Terra',
        hex: '#A45A3D'
    }],
    upgradeOptions: {
        interior: [{name: 'Leather Seats', price: 1500}, {name: 'Heated Seats', price: 800}, {
            name: 'Sunroof',
            price: 1200
        }],
        performance: [{name: 'Sport Suspension', price: 1000}, {name: 'Turbocharger', price: 3000}],
        technology: [{name: 'Premium Sound System', price: 700}, {name: 'Navigation System', price: 1000}]
    },
    insuranceOptions: [{planName: 'Basic Coverage', pricePerYear: 1200}, {
        planName: 'Comprehensive Coverage',
        pricePerYear: 1800
    }, {planName: 'Premium Coverage', pricePerYear: 2500}],
    specs: {
        engine: "2.5L 4-Cylinder",
        transmission: "8-Speed Automatic",
        mileage: "New",
        colorOptions: ['Celestial Silver Metallic']
    }
}, {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 22999,
    images: ['https://images.unsplash.com/photo-1593642632784-8b12e8b4c2e5?w=500', 'https://images.unsplash.com/photo-1593642632784-8b12e8b4c2e6?w=500', 'https://images.unsplash.com/photo-1593642632784-8b12e8b4c2e7?w=500'],
    colors: [{name: 'Crystal Black Pearl', hex: '#212121'}, {
        name: 'Lunar Silver Metallic',
        hex: '#C0C0C0'
    }, {name: 'Rallye Red', hex: '#C72C41'}],
    upgradeOptions: {
        interior: [{name: 'Leather Seats', price: 1400}, {name: 'Heated Seats', price: 700}],
        performance: [{name: 'Sport Exhaust System', price: 1200}, {name: 'Cold Air Intake', price: 600}],
        technology: [{name: 'Bluetooth Connectivity', price: 300}, {name: 'Advanced Safety Package', price: 900}]
    },
    insuranceOptions: [{planName: 'Basic Coverage', pricePerYear: 1100}, {
        planName: 'Comprehensive Coverage',
        pricePerYear: 1700
    }, {planName: 'Premium Coverage', pricePerYear: 2300}],
    specs: {
        engine: "1.5L Turbo 4-Cylinder", transmission: "CVT", mileage: "New", colorOptions: ['Platinum White Pearl']
    }
}, {
    id: 3,
    make: 'Ford',
    model: 'Mustang',
    year: 2022,
    price: 35999,
    images: ['https://images.unsplash.com/photo-1511918984145-9c1c5e6a1f6a?w=500', 'https://images.unsplash.com/photo-1511918984145-9c1c5e6a1f6b?w=500', 'https://images.unsplash.com/photo-1511918984145-9c1c5e6a1f6c?w=500'],
    colors: [{name: 'Race Red', hex: '#EA3A30'}, {name: 'Shadow Black', hex: '#101820'}, {
        name: 'Oxford White',
        hex: '#F6F6F6'
    }],
    upgradeOptions: {
        interior: [{name: 'Leather Seats', price: 2000}, {name: 'Heated and Ventilated Seats', price: 2500}],
        performance: [{name: 'Performance Package', price: 4000}, {name: 'MagnaFlow Exhaust System', price: 1500}],
        technology: [{name: 'B&O Sound System', price: 800}, {
            name: 'Navigation System with Voice Control',
            price: 1200
        }]
    },
    insuranceOptions: [{planName: 'Basic Coverage', pricePerYear: 1500}, {
        planName: 'Comprehensive Coverage',
        pricePerYear: 2200
    }, {planName: 'Premium Coverage', pricePerYear: 3000}],
    specs: {
        engine: "2.3L EcoBoost", transmission: "10-Speed Automatic", mileage: "New", colorOptions: ['Race Red']
    }
}, {
    id: 4,
    make: "BMW",
    model: "3 Series",
    year: 2024,
    price: 43999,
    images: ["https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=500", "https://images.unsplash.com/photo-1523983388277-df9d62d8fef9?w=500", "https://images.unsplash.com/photo-1523983388277-e9d62d8fef9a?w=500"],
    colors: [{name: "Alpine White", hex: "#FFFFFF"}, {name: "Black Sapphire", hex: "#000000"}, {
        name: "Mineral Grey",
        hex: "#7B7B7B"
    }],
    upgradeOptions: {
        interior: [{name: "Leather Upholstery", price: 2500}, {name: "Heated Front Seats", price: 800}],
        performance: [{name: "M Sport Package", price: 4500}, {name: "Adaptive M Suspension", price: 1200}],
        technology: [{name: "Navigation System", price: 1000}, {name: "Harman Kardon Sound System", price: 1200}]
    },
    insuranceOptions: [{planName: "Basic Coverage", pricePerYear: 1500}, {
        planName: "Comprehensive Coverage",
        pricePerYear: 2200
    }, {planName: "Premium Coverage", pricePerYear: 3000}],
    specs: {
        engine: "2.0L TwinPower Turbo",
        transmission: "8-Speed Automatic",
        mileage: "New",
        colorOptions: ["Alpine White"]
    }
}, {
    id: 5,
    make: "Tesla",
    model: "Model S",
    year: 2024,
    price: 89999,
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500", "https://images.unsplash.com/photo-1560958089-b8a1929cea88?w=500", "https://images.unsplash.com/photo-1560958089-b8a1929cea87?w=500"],
    colors: [{name: "Pearl White Multi-Coat", hex: "#EAEAEA"}, {
        name: "Midnight Silver Metallic",
        hex: "#484848"
    }, {name: "Deep Blue Metallic", hex: "#003DA5"}],
    upgradeOptions: {
        interior: [{name: "Premium Interior Package", price: 2000}, {name: "Heated Seats Front and Rear", price: 800}],
        performance: [{name: "Ludicrous Mode Upgrade", price: 15000}, {name: "All-Wheel Drive", price: 4000}],
        technology: [{name: "Full Self-Driving Capability", price: 10000}, {name: "Enhanced Autopilot", price: 6000}]
    },
    insuranceOptions: [{planName: "Basic Coverage", pricePerYear: 1800}, {
        planName: "Comprehensive Coverage",
        pricePerYear: 2500
    }, {planName: "Premium Coverage", pricePerYear: 3500}],
    specs: {
        engine: "Dual Motor All-Wheel Drive",
        transmission: "Single-Speed Fixed Gear",
        mileage: "New",
        colorOptions: ["Pearl White Multi-Coat"]
    }
}];


document.addEventListener('DOMContentLoaded', () => {
    const carGrid = document.getElementById('carGrid');
    const notification = document.getElementById('notification');


    function showNotification(message) {
        notification.textContent = message; // Set the notification message
        notification.classList.remove('hidden'); // Show the notification
        setTimeout(() => {
            notification.classList.add('hidden'); // Hide after a delay
        }, 3000); // Duration in milliseconds
    }

    function addToWishlist(carId) {
        const car = cars.find((c) => c.id === carId);
        if (car) {
            const wishlist = JSON.parse(localStorage.getItem('lml_wishlist') || '[]');
            wishlist.push(car);
            localStorage.setItem('lml_wishlist', JSON.stringify(wishlist));
            showNotification('Added to Wishlist');
            // and redirect to RequestCar.html
            window.location.href = 'requestCar.html?carId=' + carId;
        } else {
            showNotification('Error adding to wishlist');
        }
    }

    function renderCarImages(images) {
        return images.map((image, index) => `
            <img src="${image}" alt="Car Image ${index + 1}" class="product-image" onclick="openImageModal(${index}, ${JSON.stringify(images)})">
        `).join('');
    }

    function renderCarCard(car) {
        return `
            <div class="product-card">
                <div class="product-image">
                    ${renderCarImages(car.images)}
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <span class="product-title">${car.make} ${car.model}</span>
                        <span class="product-price">$${car.price.toLocaleString()}</span>
                    </div>
                    <div class="product-subtitle">Year: ${car.year}</div>
                    <div class="product-actions">
                        <button class="wishlist-btn" data-car-id="${car.id}" onclick="addToWishlist(${car.id})">
                            ${getWishlistSVG()}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function getWishlistSVG() {
        return `
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
              3.81 14.76 3 16.5 3 
              19.58 3 22 5.42 22 8.5c0 
              3.78-3.4 6.86-8.55 
              11.54L12 21.35z" fill="#e74c3c"/>
            </svg>
        `;
    }

    function renderCarGrid() {
        carGrid.innerHTML = cars.map(renderCarCard).join('');
    }

    function renderCarGrid() {
        carGrid.innerHTML = cars.map(renderCarCard).join('');
    }

    function openImageModal(currentIndex, images) {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = `
            <span class="close" onclick="this.parentElement.remove()">&times;</span>
            <button class="prev" onclick="changeImage(-1)">&#10094;</button>
            <img class="modal-content" src="${images[currentIndex]}" alt="Car Image">
            <button class="next" onclick="changeImage(1)">&#10095;</button>
        `;

        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        let currentImageIndex = currentIndex;

        window.changeImage = function (direction) {
            currentImageIndex += direction;

            if (currentImageIndex >= images.length) currentImageIndex = 0;
            if (currentImageIndex < 0) currentImageIndex = images.length - 1;

            const imgElement = modal.querySelector('.modal-content');
            imgElement.src = images[currentImageIndex];
        };
    }

    renderCarGrid();
    showNotification('Welcome, ' + localStorage.getItem('username'));
});

