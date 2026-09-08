
import express from 'express';
import mongoose from 'mongoose';
import redis from 'redis';
import pg from 'pg';
import os from 'os';



const { Pool, Client } = pg



const REDS_HOST = 'redis';
const REDIS_PORT = 6379;

const PORT = 4000;
const app = express();

const redisClient = redis.createClient(
  {
    url: `redis://${REDS_HOST}:${REDIS_PORT}`
  }
);

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('connected to redis.....'));
redisClient.connect();



const db_user = 'root';
const db_password = 'example';
const db_host = 'db';
const db_port = 5432;



const connectionString = `postgresql://${db_user}:${db_password}@${db_host}:${db_port}`

const pool = new Pool({
  connectionString,
})

// 1. Test the connection immediately when the application starts
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection failed:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL database successfully!');
  release(); // Release the client back to the pool
});

// 2. Handle unexpected errors on idle clients within the pool
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle client:', err);
});








// const mongo_user = 'root';
// const mongo_password = 'example';
// const mongo_host = 'mongo';
// const mongo_port = 27017;

// const URL = `mongodb://${mongo_user}:${mongo_password}@${mongo_host}:${mongo_port}/testDB?authSource=admin`

// mongoose.connect(URL).then(() => console.log("Conected")).catch((err) => console.log("connect Error", err) )

// const bookSchema = new mongoose.Schema({ title: String });
// const Book = mongoose.model('Book', bookSchema);

app.get("/", async (req, res) => {

  try {
    // const books = await Book.find();
    // const bookTitle = books[0].title;
    const result = await pool.query("SELECT NOW()");
    const dbTime = result.rows[0].now;
    redisClient.set('prodact','RAMs')
    console.log(`trafic from: ${os.hostname}`);
    res.send(`<h1>hello from WatchTowr </h1>`);
  } catch (error) {
    console.log("تفاصيل الخطأ:", error); // <-- اضف السطر ده
    res.status(500).send("حدث خطأ أثناء جلب البيانات");
  }
  
  
});


////////////////////////////////

app.get("/prodact", async (req, res) => {

  try {
    const books = await Book.find();
    const bookTitle = books[0].title;
    const prodact = await redisClient.get('prodact')
    res.send(`<h1>hello from test app ${bookTitle} hi hi2 hi3</h1>\n <h2>${prodact}</h2>`);
  } catch (error) {
    console.log("تفاصيل الخطأ:", error); // <-- اضف السطر ده
    res.status(500).send("حدث خطأ أثناء جلب البيانات");
  }
  
  
}); 


app.listen(PORT, () => {
  console.log(`The App Is running On Port ${PORT}`);
});