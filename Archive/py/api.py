from flask import Flask, jsonify
import math

app = Flask(__name__)

# Configuration
SHIPPING_CONFIG = {
    'weight': {
        'initial_cost': 300,
        'initial_limit': 1,
        'additional_cost': 50,
        'max_limit': 70
    },
    'quantity': {
        'initial_cost': 300,
        'initial_limit': 1,
        'additional_cost': 60,
        'max_limit': 30
    }
}

def calculate_shipping_cost(mode, value):
    if mode not in SHIPPING_CONFIG:
        return {"result": "rejected", "reason": f"Error : mode must be 'quantity' or 'weight'"}

    config = SHIPPING_CONFIG[mode]

    try:
        value = float(value)
    except ValueError:
        return {"result": "rejected", "reason": f"Error : {mode} must be a numeric value"}

    if value <= 0:
        return {"result": "rejected", "reason": f"Error : {mode} must be greater than 0"}

    if value > config['max_limit']:
        return {"result": "rejected", "reason": f"Maximum {mode} per package is {config['max_limit']}"}

    cost = config['initial_cost']
    if value > config['initial_limit']:
        additional = math.ceil(value - config['initial_limit'])
        cost += additional * config['additional_cost']

    return {"result": "accepted", "cost": cost}

@app.route('/ship_cost_api/<mode>/<value>')
def ship_cost_api(mode, value):
    return jsonify(calculate_shipping_cost(mode, value))

@app.route('/update_order', methods=['POST'])
def update_order():
    data = request.json
    order_id = data.get('order_id')
    sales_manager_id = data.get('sales_manager_id')
    order_status = data.get('order_status')

    if order_id not in orders:
        return jsonify({"result": "failure", "message": "Order not found"})

    orders[order_id]['sales_manager_id'] = sales_manager_id
    orders[order_id]['order_status'] = order_status

    shipping_cost_data = calculate_shipping_cost('quantity', orders[order_id]['order_quantity'])
    if shipping_cost_data['result'] == 'accepted':
        orders[order_id]['shipping_cost'] = shipping_cost_data['cost']
    else:
        return jsonify({"result": "failure", "message": shipping_cost_data['reason']})

    return jsonify({"result": "success", "order": orders[order_id]})

@app.route('/api/', methods=['GET'])
def api():
    return jsonify({"result": "success", "message": "Hello from the API!"})

@app.route('/', methods=['GET'])
def index():
    return jsonify({"result": "failure", "message": "Allowed only from /api"})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

