export class OrderSummary {
    constructor(container, orderSummaryElement, subtotalElement, totalElement, depositElement, deliveryElement) {
        this.container = container;
        this.orderSummary = orderSummaryElement;
        this.subtotalAmount = subtotalElement;
        this.totalAmount = totalElement;
        this.depositAmount = depositElement;
        this.estimatedDelivery = deliveryElement;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add click handlers for expandable sections
        this.orderSummary.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.toggle-details');
            if (toggleBtn) {
                const details = toggleBtn.nextElementSibling;
                const icon = toggleBtn.querySelector('.toggle-icon');
                details.classList.toggle('hidden');
                icon.textContent = details.classList.contains('hidden') ? '+' : '-';
            }
        });
    }

    render(items) {
        if (!Array.isArray(items)) { /* ... */ }
        this.orderSummary.innerHTML = items.map(item => `
            <tr class="border-b hover:bg-gray-50 transition-colors duration-150 cursor-pointer" data-id="${item.id}">
                <td class="py-6 px-4">
                    <div class="flex flex-col space-y-4">
                        <!-- Vehicle Header -->
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3 class="text-xl font-semibold text-gray-900">
                                    ${item.make} ${item.model}
                                </h3>
                                <p class="text-gray-600 text-sm mt-1">
                                    Color: <span class="font-medium">${item.color}</span>
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-2xl font-bold text-gray-900">
                                    $${Number(item.totalPrice).toLocaleString()}
                                </p>
                                <p class="text-sm text-gray-500 mt-1">Base Price: $${Number(item.price).toLocaleString()}</p>
                            </div>
                        </div>

                        <!-- Expandable Details Button -->
                        <button 
                            class="toggle-details flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            aria-expanded="false"
                            aria-controls="details-${item.id}" 
                            onclick="this.toggleDetails(event)">
                            <span class="toggle-icon mr-2 font-bold">+</span>
                            View Details
                        </button>

                        <!-- Expandable Details Section -->
                        <div id="details-${item.id}" class="hidden pl-4 space-y-4 border-l-2 border-gray-200">
                            <!-- Upgrades Section -->
                            ${item.upgrades.length > 0 ? `
                                <div class="space-y-2">
                                    <h4 class="font-semibold text-gray-700">Selected Upgrades</h4>
                                    <ul class="list-disc pl-5 text-gray-600">
                                        ${item.upgrades.map(upgrade => `
                                            <li>${upgrade}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}

                            <!-- Insurance Plans Section -->
                            ${item.insurancePlans.length > 0 ? `
                                <div class="space-y-2">
                                    <h4 class="font-semibold text-gray-700">Insurance Plans</h4>
                                    <div class="grid gap-2">
                                        ${item.insurancePlans.map(plan => `
                                            <div class="flex justify-between items-center bg-gray-50 p-2 rounded shadow-sm">
                                                <span class="text-gray-700">${plan.planName}</span>
                                                <span class="font-medium">$${Number(plan.annualPremium).toLocaleString()}/year</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Additional Details -->
                            <div class="text-sm text-gray-500">
                                <p>Added to cart: ${new Date(item.dateAdded).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Function to toggle details visibility
    toggleDetails(event) {
        const button = event.currentTarget;
        const detailsId = button.getAttribute('aria-controls');
        const detailsSection = document.getElementById(detailsId);

        // Toggle visibility
        if (detailsSection.classList.contains('hidden')) {
            detailsSection.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
            button.querySelector('.toggle-icon').textContent = '−'; // Change to minus icon
        } else {
            detailsSection.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            button.querySelector('.toggle-icon').textContent = '+'; // Change back to plus icon
        }
    }

    updateTotals(subtotal, discount = 0, licensingFee = 0, tradeInValue = 0) {
        subtotal = Number(subtotal) || 0;
        discount = Number(discount) || 0;
        licensingFee = Number(licensingFee) || 0;
        tradeInValue = Number(tradeInValue) || 0;

        const total = subtotal - discount + licensingFee - tradeInValue;
        const deposit = total * 0.1; // 10% deposit

        // Create a summary breakdown
        const summaryHTML = `
            <div class="space-y-4 bg-gray-50 p-6 rounded-lg mt-6">
                <div class="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span class="font-medium">$${subtotal.toLocaleString()}</span>
                </div>
                
                ${discount > 0 ? `
                    <div class="flex justify-between items-center text-green-600">
                        <span>Discount</span>
                        <span class="font-medium">-$${discount.toLocaleString()}</span>
                    </div>
                ` : ''}
                
                ${licensingFee > 0 ? `
                    <div class="flex justify-between items-center text-gray-600">
                        <span>Licensing Fee</span>
                        <span class="font-medium">+$${licensingFee.toLocaleString()}</span>
                    </div>
                ` : ''}
                
                ${tradeInValue > 0 ? `
                    <div class="flex justify-between items-center text-green-600">
                        <span>Trade-In Value</span>
                        <span class="font-medium">-$${tradeInValue.toLocaleString()}</span>
                    </div>
                ` : ''}
                
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <div class="flex justify-between items-center text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span id="totalAmount">$${total.toFixed(2)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center mt-2 text-blue-600">
                        <span>Deposit Due Today (10%)</span>
                        <span class="font-bold" id="DepositAmount">$${deposit.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="mt-6 bg-blue-500 p-4 rounded-lg text-white font-bold">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium" id="estimatedDelivery">
                        Estimated Delivery: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                </div>
            </div>
        `;

        // Update the summary elements
        this.subtotalAmount.innerHTML = summaryHTML;

        return { total, deposit };
    }
}