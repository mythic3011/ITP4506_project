import json
import random
from faker import Faker
import string

# Initialize Faker for realistic user data
fake = Faker()

# Constants
makes = ["LMC"]
models = {
    "LMC": [
        "Camry", "Corolla", "RAV4", "F-150", "Mustang", "Explorer",
        "Silverado", "Malibu", "Equinox", "Civic", "Accord",
        "CR-V", "Altima", "Rogue", "Sentra", "3 Series",
        "X5", "Z4", "C-Class", "G-Class", "A3",
        "Camaro", "Elantra", "Optima", "Mazda 6",
        "Passat", "300", "Charger", "Fusion",
        "Rio", "Mazda 3", "Jetta", "Sorento",
        "CX-5", "Atlas", "Bronco", "Model Y",
        "Wrangler", "E-Class", "GLA", "Golf",
        "Tiguan"
    ]
}

insurance_plan_names = [
    'Basic Liability Coverage',
    'Comprehensive Coverage',
    'Collision Coverage',
    'Uninsured Motorist Protection'
]


# Function to generate mock insurance data
def generate_mock_insurance_data():
    vehicle = {
        'make': random.choice(makes),
        'model': random.choice(models['LMC']),
        'manufacturing_year': random.randint(2000, 2023),
        'registration_number': fake.license_plate(),
        'first_registration_date': str(fake.date_this_decade()),
        'engine_capacity': random.randint(1000, 3000),  # Engine capacity in cc
        'market_value': random.randint(10000, 50000),  # Market value in HKD
        'chassis_number': fake.ssn(),  # Placeholder for chassis number
        'engine_number': fake.ssn()  # Placeholder for engine number
    }

    policy_info = {
        'insurance_plan': random.choice(insurance_plan_names),
        'insurance_type': random_insurance_type(),
        'payment_method': 'Yearly | Credit Card',
        'fees': f'HK${random.randint(60000, 80000)}.00',
        'no_claims_discount': random.randint(0, 100),
        'car_type': random.choice(['Petrol', 'Diesel', 'Electric'])
    }

    main_driver = {
        'full_name': fake.name(),
        'gender': random.choice(['Male', 'Female']),
        'hkid': generate_hk_id(),
        'date_of_birth': str(fake.date_of_birth(minimum_age=18)),
        'contact_email': fake.email(),
        'mobile': fake.phone_number(),
        'occupation': fake.job(),
        'address': fake.address()
    }

    application_data = {
        'id': f'LMC-{random.randint(1000000000000, 9999999999999)}',
        'application_status': random_status(),
        'application_details': {
            'insurance_plan': policy_info,
            'vehicle_details': vehicle,
            'main_driver_details': main_driver
        }
    }

    return json.dumps(application_data, indent=4)


def random_status():
    """Generate a random application status."""
    return random.choice(['Pending', 'Approved', 'Rejected', 'Cancelled'])


def generate_hk_id():
    """Generate a valid Hong Kong Identity Card (HKID) number."""
    letters = ''.join(random.choices(string.ascii_uppercase, k=random.randint(1, 2)))
    digits = ''.join(random.choices(string.digits, k=6))
    check_digit = calculate_check_digit(letters + digits)
    return f'{letters}{digits}({check_digit})'


def calculate_check_digit(hkid_without_check_digit):
    """Calculate the check digit for HKID."""
    total = 0
    for i, char in enumerate(hkid_without_check_digit):
        if char.isalpha():
            total += (ord(char) - ord('A') + 10) * (8 - i)
        else:
            total += int(char) * (8 - i)

    remainder = total % 11
    return str(remainder) if remainder < 10 else 'A'


def random_insurance_type():
    """Randomly select an insurance type."""
    return random.choice(['Full Coverage', 'Third Party'])


# Main execution block to generate mock data
if __name__ == "__main__":
    try:
        num_of_mock = int(input("Enter the number of mock data you want to generate: "))

        if num_of_mock <= 0 :
            raise ValueError("The number must be a positive integer.")

        store = input("Enter the file name you want to store the mock data (e.g., mock_data.json): ")

        with open(store, 'w') as file:
            for _ in range(num_of_mock):
                mock_data = generate_mock_insurance_data()
                file.write(mock_data + '\n')

        print(f"Mock data successfully generated and stored in '{store}'.")

    except ValueError as e:
        print(f"Invalid input: {e}")
