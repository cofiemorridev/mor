#!/bin/bash

echo "Setting up MongoDB for Coconut Oil E-commerce..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    # For Ubuntu/Debian based systems (Codespace)
    sudo apt-get update
    sudo apt-get install -y mongodb
fi

# Start MongoDB service
echo "Starting MongoDB service..."
sudo service mongodb start || sudo service mongod start

# Create database and collections
echo "Creating database..."
mongo --eval "
    use coconut_oil_ecommerce;
    db.createCollection('admins');
    db.createCollection('products');
    db.createCollection('orders');
    print('Database and collections created');
" 2>/dev/null || echo "MongoDB connection failed"

echo "MongoDB setup complete!"
echo "Connection URI: mongodb://localhost:27017/coconut_oil_ecommerce"
