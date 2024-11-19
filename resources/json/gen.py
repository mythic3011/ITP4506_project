import json
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# Predefined lists for makes and models
makes = ["LMC"]
models = {"LMC": ["Camry", "Corolla", "RAV4", "F-150", "Mustang", "Explorer", "Silverado", "Malibu", "Equinox", "Civic",
    "Accord", "CR-V", "Altima", "Rogue", "Sentra", "3 Series", "X5", "Z4", "C-Class", "G-Class", "A3", "Camaro",
    "Elantra", "Optima", "Mazda 6", "Passat", "300", "Charger", "Fusion", "Rio", "Mazda 3", "Jetta", "Sorento", "CX-5",
    "Atlas", "Bronco", "Model Y", "Wrangler", "E-Class", "GLA", "Golf", "Tiguan"]}

# Define possible upgrade options with more realistic choices
interior_upgrades = [{"name": "Leather Seats", "additionalCost": 1200}, {"name": "Heated Seats", "additionalCost": 787},
                     {"name": "Sunroof", "additionalCost": 1172}, {"name": "Ventilated Seats", "additionalCost": 950},
                     {"name": "Premium Upholstery", "additionalCost": 1500},
                     {"name": "Ambient Lighting", "additionalCost": 300}, ]

performance_upgrades = [{"name": "Sport Suspension", "additionalCost": 835},
                        {"name": "Turbocharger", "additionalCost": 2771},
                        {"name": "Performance Tires", "additionalCost": 600},
                        {"name": "Enhanced Braking System", "additionalCost": 1200},
                        {"name": "Cold Air Intake", "additionalCost": 400}, ]

technology_upgrades = [{"name": "Premium Sound System", "additionalCost": 672},
                       {"name": "Navigation System", "additionalCost": 962},
                       {"name": "Bluetooth Connectivity", "additionalCost": 250},
                       {"name": "Backup Camera", "additionalCost": 500},
                       {"name": "Adaptive Cruise Control", "additionalCost": 1200}, ]

insurance_plan_names = ['Basic Liability Coverage', 'Comprehensive Coverage', 'Collision Coverage',
                        'Uninsured Motorist Protection', ]


# Function to generate unique upgrade options


def generate_unique_upgrades():
    selected_interior = random.sample(interior_upgrades, k=random.randint(1, len(interior_upgrades)))
    selected_performance = random.sample(performance_upgrades, k=random.randint(1, len(performance_upgrades)))
    selected_technology = random.sample(technology_upgrades, k=random.randint(1, len(technology_upgrades)))

    return {'interiorUpgrades': selected_interior, 'performanceUpgrades': selected_performance,
            'technologyUpgrades': selected_technology, }


def get_random_model(make):
    return random.choice(models[make])


# Function to create a vehicle entry


def create_vehicle(id, used_plan_names):
    upgrades = generate_unique_upgrades()  # Generate upgrades once

    # Base price can be adjusted based on vehicle type or other logic
    base_price = random.randint(20000, 35000)

    # Generate unique insurance plans ensuring unique plan names
    insurance_plans = []  # Use a list to store insurance plans

    while len(insurance_plans) < random.randint(1, 3):
        plan_name = random.choice(insurance_plan_names)

        if plan_name not in used_plan_names:
            used_plan_names.add(plan_name)  # Mark this plan name as used

            insurance_plans.append(
                {'planName': plan_name, 'annualPremium': int(base_price * random.uniform(0.05, 0.15)),
                 'coverageLimit': int(base_price * random.uniform(2, 5)),
                 'deductible': random.choice([250, 500, 1000]), })

    chosen_make = random.choice(makes)

    return {'id': id, 'make': chosen_make, 'model': get_random_model(chosen_make),  # Caching used here
            'modelCode': fake.bothify(text='??###'), 'manufacturingYear': random.randint(2020, 2024),
            'carType': random.choice(["SUV", "Sedan", "Truck"]), 'fuelType': random.choice(["Gasoline", "Diesel"]),
            'year': random.randint(2010, 2024), 'specifications': {
            'engine': {'type': f"{random.randint(1, 5)}.{random.randint(0, 9)}L",
                       'cylinderCount': random.choice([4, 6]), 'horsepower': random.randint(100, 400),
                       'torque': random.randint(100, 500), 'drivetrain': random.choice(['AWD', 'FWD', 'RWD']), },
            'transmission': {'type': random.choice(['Manual', 'Automatic']), 'gears': random.choice([5, 6]), },
            'mileage': {'value': random.randint(1000, 50000), 'unit': 'miles', }, 'safetyRating': random.randint(1, 5),
            'warrantyYears': random.randint(1, 5), },  # Set price to base_price only
            'price': base_price,  # Generate two unique image URLs for each vehicle
            'images': [{'url': fake.image_url(width=500, height=300)},
                       {'url': fake.image_url(width=500, height=300)}, ],
            # Generate a list of available colors with unique names and hex codes
            'availableColors': [{'name': fake.color_name(), 'hexCode': fake.hex_color()} for _ in
                                range(random.randint(1, 5))],  # Include generated upgrade options in the vehicle data
            'upgradeOptions': upgrades,  # Linked insurance plans for the vehicle with realistic values
            'insurancePlans': insurance_plans, }


# Generate a list of vehicles based on specified number of vehicles to create


def generate_vehicles(num_vehicles):
    used_plan_names = set()  # Set to keep track of used plan names

    vehicles = [create_vehicle(i + 1, used_plan_names) for i in range(num_vehicles)]

    return vehicles


# Main function to write generated vehicle data to vehicles.json file


def main():
    try:
        num_of_vehicles = int(input("Enter the number of vehicles to generate: ")) or 10

        vehicles_data = generate_vehicles(num_of_vehicles)

        with open('vehicles2.json', 'w') as json_file:
            json.dump(vehicles_data, json_file, indent=4)
            print(f"Successfully generated {num_of_vehicles} vehicles in vehicles.json.")

    except ValueError as ve:
        print(f"Input error: {ve}. Please enter a valid number.")
    except IOError as e:
        print(f"Error writing to file: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
