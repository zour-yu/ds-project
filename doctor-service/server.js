const app = require("./app");
const connectDB = require("./config/db");

require("dotenv").config();

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Doctor Service running on port ${PORT}`);
});