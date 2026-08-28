const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { createClient } = require('redis');


const Product = require('./models/Product');

const app = express();

const PORT = process.env.PORT || 4000;

// ========================================== 
// Redis Connection 
// ==========================================

const REDIS_HOST = 'redis'; 
const REDIS_PORT = 6379; 
const client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});
client.on('error', (err) => {
  console.log('Redis Client Error:', err);
});
client.on('connect', () => {
  console.log('Connected to Redis');
});

// ==========================
// Middleware
// ==========================

app.use(express.json());

app.use(express.static(__dirname));


// ==========================
// Home Page
// ==========================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// ==========================
// MongoDB Connection
// ==========================

const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_PORT = 27017;
const DB_HOST = 'mongo';
const DB_NAME = 'test';

const URI =
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

mongoose.connect(URI)

  .then(() => {
    console.log('Connected to MongoDB');
  })

  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err);
  });


// =========================
// Get data
// =========================

app.get('/data', async (req, res) => {


});

// ==========================
// GET - Get all products
// ==========================

app.get('/products', async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (err) {

    res.status(500).json({
      message: 'Error getting products',
      error: err.message
    });

  }

});


// ==========================
// POST - Add product
// ==========================

app.post('/products', async (req, res) => {

  try {

    const { name, price, quantity } = req.body;

    const product = new Product({
      name,
      price,
      quantity
    });
// save to redis
    const savedProduct = await product.save();
    try {
        await client.set(
        `product:${savedProduct._id}`,
        JSON.stringify(savedProduct)
        );
    } catch (redisError) {
        console.log('Redis cache error:', redisError.message);
    }
// save to redis
    // 3. Return product
    res.status(201).json(savedProduct);

    res.status(201).json(savedProduct);

  } catch (err) {

    res.status(500).json({
      message: 'Error adding product',
      error: err.message
    });

  }

});


// ==========================
// PUT - Update product
// ==========================

app.put('/products/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedProduct) {

      return res.status(404).json({
        message: 'Product not found'
      });

    }

    // 2. Update Redis cache
    try {
        await client.set(
            `product:${updatedProduct._id}`,
            JSON.stringify(updatedProduct)
        );
    } catch (redisError) {
        console.log('Redis cache error:', redisError.message);
    }

    // 3. Return updated product

    res.json(updatedProduct);

  } catch (err) {

    res.status(500).json({
      message: 'Error updating product',
      error: err.message
    });

  }

});


// ==========================
// DELETE - Delete product
// ==========================

app.delete('/products/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const deletedProduct =
      await Product.findByIdAndDelete(id);

    if (!deletedProduct) {

      return res.status(404).json({
        message: 'Product not found'
      });

    }
        try {
            await client.del(`product:${id}`);
        } catch (err) {
            console.log('Redis cache error:', redisError.message);
        }
        
    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });

  } catch (err) {

    res.status(500).json({
      message: 'Error deleting product',
      error: err.message
    });

  }

});



// ==========================
// Start Server
// ==========================

async function startServer() {

  try {

    // Connect to Redis
    await client.connect();

    console.log('Redis connection established');


    // Start Express Server
    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      'Failed to start server:',
      error
    );

  }

}

startServer();

