import app from "./src/app";
import { connectToMongoDB  } from "./src/database/mongodb";
import { PORT } from "./src/config/constants";

connectToMongoDB ()
  .then(() => {
    console.log("MongoDB connection established, starting server...");

    app.listen(PORT, () => {
      console.log(`Server running: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB, server not started.", error);
    process.exit(1);
  });