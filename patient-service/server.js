// patient-service/server.js
const app = require('./app');
const connectDB = require('./config/db');

// In a real project you might use dotenv to load this
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Patient Service is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start Patient Service:", err.message);
});
