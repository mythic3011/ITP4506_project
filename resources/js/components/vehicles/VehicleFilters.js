export function renderVehicleFilters() {
  return `
    <div class="filter-group">
      <select id="makeFilter" class="filter-select">
        <option value="">All Makes</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="BMW">BMW</option>
        <option value="Tesla">Tesla</option>
      </select>

      <select id="priceFilter" class="filter-select">
        <option value="">Price Range</option>
        <option value="0-25000">Under $25,000</option>
        <option value="25000-50000">$25,000 - $50,000</option>
        <option value="50000-75000">$50,000 - $75,000</option>
        <option value="75000-100000">$75,000 - $100,000</option>
        <option value="100000-999999">$100,000+</option>
      </select>

      <select id="yearFilter" class="filter-select">
        <option value="">All Years</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>
    </div>
  `;
}