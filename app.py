from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Liste des produits
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
    },
    {
        'id': 3,
        'name': 'MacBook Pro 14',
        'price': 2500,
        'description': 'Le MacBook Pro avec la puce M1 Pro',
        'categorie': 'Ordinateur',
        'image': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202110?wid=892&hei=820&&qlt=80&.v=1633657387000'
    },
    {
        'id': 4,
        'name': 'Samsung Galaxy S22',
        'price': 1200,
        'description': 'Le Samsung Galaxy S22 avec écran AMOLED',
        'categorie': 'Téléphone',
        'image': 'https://images.samsung.com/is/image/samsung/assets/africa_fr/smartphones/galaxy-s22-ultra/images/galaxy-s22-ultra-highlights-kv.png'
    },
    {
        'id': 5,
        'name': 'Coca-Cola 1.5L',
        'price': 1.5,
        'description': 'Boisson gazeuse Coca-Cola, 1.5 litre',
        'categorie': 'Boisson',
        'image': 'https://www.coca-cola.com/content/dam/journey/fr/fr/private/brands/coca-cola-zero-sugar/coca-cola-zero-sugar-20oz-hero.jpg'
    },
    {
        'id': 6,
        'name': 'Sony WH-1000XM4',
        'price': 350,
        'description': 'Casque audio à réduction de bruit',
        'categorie': 'Accessoire',
        'image': 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SY355_.jpg'
    },
    {
        'id': 7,
        'name': 'Nintendo Switch',
        'price': 400,
        'description': 'Console de jeu hybride',
        'categorie': 'Jeux vidéo',
        'image': 'https://m.media-amazon.com/images/I/61-PblYntsL._AC_SY679_.jpg'
    },
    {
        'id': 8,
        'name': 'Bouteille d\'eau Evian 1L',
        'price': 1,
        'description': 'Bouteille d\'eau minérale naturelle',
        'categorie': 'Boisson',
        'image': 'https://www.evian.com/sites/evian_france/files/2021-06/Evian%20naturelle%201L%20PET.png'
    }
]

# Données de vente
sales_data = [
    {'product_id': 1, 'quantity_sold': 50, 'total_sales': 100000, 'date': '2024-09-10'},
    {'product_id': 2, 'quantity_sold': 150, 'total_sales': 300, 'date': '2024-09-11'},
    {'product_id': 1, 'quantity_sold': 30, 'total_sales': 60000, 'date': '2024-09-12'},
    {'product_id': 2, 'quantity_sold': 100, 'total_sales': 200, 'date': '2024-09-13'}
]

# Données de réapprovisionnement
restock_data = [
    {'product_id': 1, 'product_name': 'Iphone 15 Pro Max', 'remaining_stock': 5, 'threshold': 10},
    {'product_id': 2, 'product_name': 'Jus d\'orange Joker', 'remaining_stock': 2, 'threshold': 5},
    {'product_id': 3, 'product_name': 'MacBook Pro 14', 'remaining_stock': 3, 'threshold': 5},
    {'product_id': 5, 'product_name': 'Coca-Cola 1.5L', 'remaining_stock': 50, 'threshold': 20}
]

# Base de données des codes-barres
barcode_data = {
    '123456789012': products[0],
    '987654321098': products[1],
    '789654123098': products[3]
}

def find_product_by_barcode(barcode):
    return barcode_data.get(barcode)

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

@app.route('/sales', methods=['GET'])
def get_sales_statistics():
    return jsonify(sales_data)

@app.route('/restock', methods=['GET'])
def get_restock_alerts():
    return jsonify(restock_data)

@app.route('/product/<barcode>', methods=['GET'])
def get_product_by_barcode(barcode):
    product = find_product_by_barcode(barcode)
    if product:
        return jsonify(product)
    return jsonify({'message': 'Produit non trouvé'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
