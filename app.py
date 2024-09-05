from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = [
    {
        'id': 1,
        'name': 'Iphone 15 Pro Max',
        'price': 2000,
        'description': 'Le dernier Iphone',
        'categorie': 'Téléphone',
        'image': 'https://proxymedia.woopic.com/api/v1/images/1618%2Fedithor%2Fterminaux%2F636x900-iPhone_15_Pro_Max_Noir-img3_6502245cc7020d1ca3f91d0a.png'
    },
    {
        'id': 2,
        'name': 'Jus d\'orange Joker',
        'price': 2,
        'description': 'Jus d\'orange pur',
        'categorie': 'Boisson',
        'image': 'https://media.houra.fr/ART-IMG-XL/09/47/3123349014709-2.jpg'
    }
]

@app.route('/products', methods=['GET'], defaults={'search': None, 'type': None})
@app.route('/products/<string:type>/<string:search>', methods=['GET'])
def get_products(search, type):
    if search is not None and type is not None:
        search = search.lower()
        if type == 'categorie':
            products_filtered = [product for product in products if search in product['categorie'].lower()]
        elif type == 'produit':
            products_filtered = [product for product in products if search in product['name'].lower()]
        else:
            return jsonify({'message': 'Type de recherche invalide'}), 400
        return jsonify(products_filtered)
    return jsonify(products)

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((product for product in products if product['id'] == product_id), None)

    if product is None:
        return jsonify({'message': 'Produit non trouvé'}), 404
    return jsonify(product)

@app.route('/products', methods=['POST'])
def add_product():
    new_product = request.json
    new_product['id'] = len(products) + 1
    products.append(new_product)

    return jsonify(new_product), 201

@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = next((product for product in products if product['id'] == product_id), None)

    if product is None:
        return jsonify({'message': 'Produit non trouvé'}), 404
    updated_data = request.json

    product.update(updated_data)
    return jsonify(product)

@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = next((product for product in products if product['id'] == product_id), None)

    if product is None:
        return jsonify({'message': 'Produit non trouvé'}), 404
    products.remove(product)

    return jsonify({'message': 'Produit supprimé'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
