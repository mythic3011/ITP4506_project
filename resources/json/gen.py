import json
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# Predefined lists for makes and models
makes = ["Toyota", "Ford", "Chevrolet", "Honda",
         "Nissan", "BMW", "Mercedes-Benz", "Volkswagen"]
models = {
    "Toyota": ["Camry", "Corolla", "RAV4"],
    "Ford": ["F-150", "Mustang", "Explorer"],
    "Chevrolet": ["Silverado", "Malibu", "Equinox"],
    "Honda": ["Civic", "Accord", "CR-V"],
    "Nissan": ["Altima", "Rogue", "Sentra"],
    "BMW": ["3 Series", "X5", "Z4"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLA"],
    "Volkswagen": ["Golf", "Jetta", "Tiguan"]
}

# Define possible upgrade options with more realistic choices
interior_upgrades = [
    {"name": "Leather Seats", "additionalCost": 1200},
    {"name": "Heated Seats", "additionalCost": 787},
    {"name": "Sunroof", "additionalCost": 1172},
    {"name": "Ventilated Seats", "additionalCost": 950},
    {"name": "Premium Upholstery", "additionalCost": 1500},
    {"name": "Ambient Lighting", "additionalCost": 300},
]

performance_upgrades = [
    {"name": "Sport Suspension", "additionalCost": 835},
    {"name": "Turbocharger", "additionalCost": 2771},
    {"name": "Performance Tires", "additionalCost": 600},
    {"name": "Enhanced Braking System", "additionalCost": 1200},
    {"name": "Cold Air Intake", "additionalCost": 400},
]

technology_upgrades = [
    {"name": "Premium Sound System", "additionalCost": 672},
    {"name": "Navigation System", "additionalCost": 962},
    {"name": "Bluetooth Connectivity", "additionalCost": 250},
    {"name": "Backup Camera", "additionalCost": 500},
    {"name": "Adaptive Cruise Control", "additionalCost": 1200},
]

insurance_plan_names = [
    "Basic Liability Coverage",
    "Comprehensive Coverage",
    "Collision Coverage",
    "Uninsured Motorist Protection",
    "Underinsured Motorist Coverage",
    "Personal Injury Protection (PIP)",
    "Medical Payments Coverage (MedPay)",
    "Rental Car Reimbursement",
    "Roadside Assistance Plan",
    "Gap Insurance",
    "Zero Depreciation Cover",
    "Emergency Medical Expenses Coverage"
]

# Function to generate unique upgrade options


def generate_unique_upgrades():
    selected_interior = random.sample(
        interior_upgrades, k=random.randint(1, len(interior_upgrades)))
    selected_performance = random.sample(
        performance_upgrades, k=random.randint(1, len(performance_upgrades)))
    selected_technology = random.sample(
        technology_upgrades, k=random.randint(1, len(technology_upgrades)))

    return {
        'interiorUpgrades': selected_interior,
        'performanceUpgrades': selected_performance,
        'technologyUpgrades': selected_technology,
    }

# Function to create a vehicle entry


def create_vehicle(id):
    upgrades = generate_unique_upgrades()  # Generate upgrades once

    # Calculate total additional cost from upgrades
    total_upgrade_cost = (
        sum(item['additionalCost'] for item in upgrades['interiorUpgrades']) +
        sum(item['additionalCost'] for item in upgrades['performanceUpgrades']) +
        sum(item['additionalCost'] for item in upgrades['technologyUpgrades'])
    )

    # Base price can be adjusted based on vehicle type or other logic
    base_price = random.randint(20000, 35000)

    return {
        'id': id,
        'make': random.choice(makes),
        'model': random.choice(models[random.choice(makes)]),
        'modelCode': fake.bothify(text='??###'),
        'manufacturingYear': random.randint(2020, 2024),
        'carType': random.choice(["SUV", "Sedan", "Truck"]),
        'fuelType': random.choice(["Gasoline", "Diesel"]),
        'year': random.randint(2010, 2024),
        'specifications': {
            'engine': {
                'type': f"{random.randint(1, 5)}.{random.randint(0, 9)}L",
                'cylinderCount': random.choice([4, 6]),
                'horsepower': random.randint(100, 400),  # Added horsepower
                'torque': random.randint(100, 500),      # Added torque
                # Added drivetrain type
                'drivetrain': random.choice(['AWD', 'FWD', 'RWD']),
            },
            'transmission': {
                'type': random.choice(['Manual', 'Automatic']),
                'gears': random.choice([5, 6]),
            },
            'mileage': {
                'value': random.randint(1000, 50000),
                'unit': 'miles',
            },
            'safetyRating': random.randint(1, 5),
            'warrantyYears': random.randint(1, 5),
        },
        # Correctly calculate price now that upgrades are fixed
        'price': base_price + total_upgrade_cost,
        # Generate two unique image URLs for each vehicle
        'images': [
            {'url': fake.image_url(width=500, height=300)},
            {'url': fake.image_url(width=500, height=300)},
        ],
        # Generate a list of available colors with unique names and hex codes
        'availableColors': [
            {'name': fake.color_name(), 'hexCode': fake.hex_color()} for _ in range(random.randint(1, 5))
        ],
        # Include generated upgrade options in the vehicle data
        'upgradeOptions': upgrades,
        # Linked insurance plans for the vehicle with realistic values
        'insurancePlans': [
            {
                # Randomly select a plan name from the list
                'planName': random.choice(insurance_plan_names),
                # Random annual premium between realistic ranges based on vehicle attributes
                'annualPremium': int(base_price * random.uniform(0.05, 0.15)),
                # Random coverage limit between realistic ranges based on price
                'coverageLimit': int(base_price * random.uniform(2, 5)),
                # Random deductible values that are common in insurance policies
                'deductible': random.choice([250, 500, 1000]),
            } for _ in range(random.randint(1, 3))
        ],
    }

# Generate a list of vehicles based on specified number of vehicles to create


def generate_vehicles(num_vehicles):
    vehicles = [create_vehicle(i + 1) for i in range(num_vehicles)]
    return vehicles

# Main function to write generated vehicle data to vehicles.json file


def main():
    num_of_vehicles = int(
        input("Enter the number of vehicles to generate: ")) or 10
    vehicles_data = generate_vehicles(num_of_vehicles)

    try:
        with open('vehicles.json', 'w') as json_file:
            json.dump(vehicles_data, json_file, indent=4)
            print(
                f"Successfully generated {num_of_vehicles} vehicles in vehicles.json.")
    except IOError as e:
        print(f"Error writing to file: {e}")


if __name__ == "__main__":
    main()
