// CustomerDashboard.js
$(document).ready(function () {
    const orders = [{
        id: 1, status: 'Picked Up', vehicle: 'LMC Camry', price: '$25000'
    }, {
        id: 2, status: 'Processing', vehicle: 'LMC Accord', price: '$22000'
    }, {id: 3, status: 'Picked Up', vehicle: 'LMC Fusion', price: '$24000'}, {
        id: 4, status: 'Processing', vehicle: 'LMC Altima', price: '$23000'
    }, {id: 5, status: 'Picked Up', vehicle: 'LMC Malibu', price: '$21000'}, {
        id: 6, status: 'Picked Up', vehicle: 'LMC Sonata', price: '$22500'
    }, {id: 7, status: 'Processing', vehicle: 'LMC Legacy', price: '$23500'}, {
        id: 8, status: 'Shipped', vehicle: 'LMC Optima', price: '$21500'
    }, {id: 9, status: 'Delivered', vehicle: 'LMC 6', price: '$26000'}, {
        id: 10, status: 'Cancelled', vehicle: 'LMC Passat', price: '$24000'
    }, {id: 11, status: 'Processing', vehicle: 'LMC 300', price: '$29000'},];


    const vehicles = [{id: 1, name: 'Toyota Camry', price: '$25000'}, {
        id: 2, name: 'Honda Accord', price: '$22000'
    }, {id: 3, name: 'Ford Fusion', price: '$24000'}, {id: 4, name: 'Nissan Altima', price: '$23000'}, {
        id: 5, name: 'Chevrolet Malibu', price: '$21000'
    }, {id: 6, name: 'Hyundai Sonata', price: '$22500'}, {id: 7, name: 'Subaru Legacy', price: '$23500'}, {
        id: 8, name: 'Kia Optima', price: '$21500'
    }, {id: 9, name: 'Mazda 6', price: '$26000'}, {id: 10, name: 'Volkswagen Passat', price: '$24000'}, {
        id: 11, name: 'Chrysler 300', price: '$29000'
    },];

    const wishlist = [{
        id: 1,
        name: 'Nissan Altima',
        price: '$23000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 2,
        name: 'Ford Fusion',
        price: '$24000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 3,
        name: 'Chevrolet Malibu',
        price: '$21000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 4,
        name: 'Hyundai Sonata',
        price: '$22500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 5,
        name: 'Subaru Legacy',
        price: '$23500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 6,
        name: 'Kia Optima',
        price: '$21500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 7,
        name: 'Mazda 6',
        price: '$26000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 8,
        name: 'Volkswagen Passat',
        price: '$24000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 9,
        name: 'Chrysler 300',
        price: 29000,
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }];

    const svgIcons = {
        salesHistory: '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>',
        orders: '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>',
        vehicles: '<svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" width="16" height="16"><path d="M21 13l-2-4V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v3l-2 4h1l3.6 7.2c.4.8 1.4 1.2 2.2.8s1.2-1.4.8-2.2L10.6 15h2.8l1-2H8.5L12 8h8l-2 5h-3.5l-1.2 2.5 1 2c.1.2.2.4.3.5L21 13zm-9.4 9c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8zm2-2c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8z"/></svg>',
        wishlist: '<svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3 .9-5 .9-5S5 .42 7 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 ..."/></svg>',
        armor: '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>',
        time: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        paid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"><circle cx="12" cy="12" r="10"/><path d="M10 16l4-4-4-4v8z"/></svg>`,
        pending: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="orange"><circle cx="12" cy="12" r="10"/><path d="M12 6v6h6v2h-8V6z"/></svg>`,
        pickedup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue"><circle cx="12" cy="12" r="10"/><path d="M6 12h12v2H6z"/></svg>`,
        processing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow"><circle cx="12" cy="12" r="10"/><path d="M10 17l5-5-5-5v10z"/></svg>`,
        shipped: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="purple"><circle cx="12" cy="12" r="10"/><path d="M6 6l12 12M18 6L6 18"/></svg>`,
        delivered: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="teal"><circle cx="12" cy="12" r="10"/><path d="M9 11l2-2l4 4l-2 2z"/></svg>`,
        cancelled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><circle cx="12" cy="12" r="10"/><path d="M15.88 8.88L16.5 9.5L13.5 12.5L16.5 15.5L15.88 16.12L12.88 13.12L9.88 16.12L9.25 15.5L12.25 12.5L9.25 9.5L9.88 8.88L12.88 11.88Z"/></svg>`
    };

    const insurance = [{
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'Pending', fee: '$10K'
    }, {name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'Approved', fee: '$102K'}, {
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'under Review', fee: '$103K'
    }, {name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'expired', fee: '$104K'}, {
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'wait for clam', fee: '$105K'
    }, {
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'wait for approval', fee: '$106K'
    }, {
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'wait for payment', fee: '$107K'
    }, {name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'Denied', fee: '$103K'}, {
        name: 'Insurance', link: '/insurance', icon: 'insurance', status: 'Cancelled', fee: '$104K'
    },];

    // Base Section class implementing the Template Pattern
    class Section {
        constructor(title, items, linkUrl, iconKey) {
            this.title = title;
            this.items = items;
            this.linkUrl = linkUrl;
            this.iconKey = iconKey;
            this.isOpen = true; // Tracks if the section is open or closed
        }

        // Method to toggle the open/close state
        toggle() {
            this.isOpen = !this.isOpen;
        }

        // Template method for rendering the section
        render() {
            return `
                <section class="">
                    <h1 class="text-xl font-semibold mb-4 cursor-default" data-title="${this.title}">
                        ${this.title}
                        <span class="toggle-icon">${this.isOpen ? '-' : '+'}</span>
                    </h1>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" style="display: ${this.isOpen ? 'grid' : 'none'};">
                        ${this.items.map(item => this.renderItem(item)).join('')}
                    </div>
                </section>
            `;
        }

        // Method to render each item (can be overridden by subclasses)
        renderItem(item) {
            return `
                <a href="${this.linkUrl}${item.id}" class="card ${this.getCardClass(item)} bg-white">
                    ${this.getStatusIcon(item)}
                    <h3>${item.name || item.vehicle}</h3>
                    <p>Status: ${item.status || 'N/A'}</p>
                    <p>Price: ${item.price || 'N/A'}</p>
                </a>
            `;
        }

        // Methods to be overridden by subclasses
        getCardClass(item) {
            return '';
        }

        getStatusIcon(item) {
            return svgIcons[this.iconKey] || '';
        }
    }

    // Derived classes for specific sections
    class OrdersSection extends Section {
        constructor(items) {
            super('Your Orders', items, './OrderDetails.html?id=', null);
        }

        getCardClass(item) {
            const classes = {
                'Paid': 'border-l-4 border-green-500',
                'Pending': 'border-l-4 border-blue-500',
                'Picked Up': 'border-l-4 border-green-500',
                'Processing': 'border-l-4 border-yellow-500',
                'Shipped': 'border-l-4 border-orange-500',
                'Delivered': 'border-l-4 border-purple-500',
                'Cancelled': 'border-l-4 border-red-500',
            };
            return classes[item.status] || '';
        }

        getStatusIcon(item) {
            const icons = {
                'Paid': svgIcons['paid'],
                'Pending': svgIcons['pending'],
                'Picked Up': svgIcons['pickedup'],
                'Processing': svgIcons['processing'],
                'Shipped': svgIcons['shipped'],
                'Delivered': svgIcons['delivered'],
                'Cancelled': svgIcons['cancelled'],
            };
            return icons[item.status] || '';
        }
    }

    class VehiclesSection extends Section {
        constructor(items) {
            super('Browse Vehicles', items, './ViewVehicles.html?id=', 'vehicles');
        }


        getCardClass() {
            return 'border-l-4 border-orange-500';
        }
    }

    class WishlistSection extends Section {
        constructor(items) {
            super('Your Wishlist', items, './Wishlist.html?id=', 'wishlist');
        }

        getCardClass() {
            return 'border-l-4 border-red-500';
        }
    }

    class InsuranceSection extends Section {
        constructor(items) {
            super('Insurance Plans', items, './Insurance/index.html?id=', 'armor');
        }

        getCardClass(item) {
            const classes = {
                'Pending': 'border-l-4 border-blue-500',
                'Approved': 'border-l-4 border-green-500',
                'Denied': 'border-l-4 border-red-500',
                'Cancelled': 'border-l-4 border-purple-500',
                'under Review': 'border-l-4 border-yellow-500',
                'expired': 'border-l-4 border-red-500',
                'wait for clam': 'border-l-4 border-green-500',
                'wait for approval': 'border-l-4 border-green-500',
                'wait for payment': 'border-l-4 border-green-500',
            };
            return classes[item.status] || '';
        }

        renderItem(item) {
            return `
                <a href="${this.linkUrl}${item.id}" class="card ${this.getCardClass(item)} bg-white">
                    ${this.getStatusIcon(item)}
                    <h3>${item.name || item.vehicle}</h3>
                    <p>Status: ${item.status || 'N/A'}</p>
                    <p>fee: ${item.fee || 'N/A'}</p>
                </a>
            `;
        }
    }

    // After defining all classes and before rendering the dashboard
    const sections = [new OrdersSection(orders), //new VehiclesSection(vehicles),
        //new WishlistSection(wishlist),
        new InsuranceSection(insurance),];

    // Function to render the entire dashboard
    function renderDashboard() {
        $('#dashboard-content').html(sections.map(section => section.render()).join(''));
    }

    // Initial rendering
    renderDashboard();

    // Event delegation for toggling sections
    $(document).on('click', '.section-title', function () {
        const title = $(this).data('title');
        const section = sections.find(sec => sec.title === title);
        section.toggle();

        // Re-render the specific section
        $(this).next('.card-container').slideToggle(300);
        $(this).find('.toggle-icon').text(section.isOpen ? '-' : '+');
    });
});
