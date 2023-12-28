const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add other options as needed
  };

  try {
	console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};
