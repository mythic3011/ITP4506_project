export class FilterManager {
    constructor() {
        this.searchInput = document.getElementById('searchVehicle');
        this.typeFilter = document.getElementById('typeFilter');
        this.fuelFilter = document.getElementById('fuelFilter');
        this.yearFilter = document.getElementById('yearFilter');
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.typeFilter.addEventListener('change', () => this.applyFilters());
        this.fuelFilter.addEventListener('change', () => this.applyFilters());
        this.yearFilter.addEventListener('change', () => this.applyFilters());
    }

    initializeFilters(vehicles) {
        // Populate year filter options
        const years = [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);
        this.yearFilter.innerHTML = '<option value="">All Years</option>' +
            years.map(year => `<option value="${year}">${year}</option>`).join('');
    }

    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const selectedType = this.typeFilter.value;
        const selectedFuel = this.fuelFilter.value;
        const selectedYear = this.yearFilter.value;

        const cards = document.querySelectorAll('.vehicle-card');
        cards.forEach(card => {
            const title = card.querySelector('.vehicle-title').textContent.toLowerCase();
            const specs = card.querySelector('.vehicle-specs').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || specs.includes(searchTerm);
            const matchesType = !selectedType || card.dataset.type === selectedType;
            const matchesFuel = !selectedFuel || card.dataset.fuel === selectedFuel;
            const matchesYear = !selectedYear || card.dataset.year === selectedYear;

            card.style.display = matchesSearch && matchesType && matchesFuel && matchesYear ? 'block' : 'none';
        });
    }
}