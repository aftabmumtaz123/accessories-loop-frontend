import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables in development
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

if (!process.env.MONGO_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGO_URI'");
}

const uri = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

try {
  if (process.env.NODE_ENV === "development") {
    // Use a global variable to preserve the client across HMR (Hot Module Replacement)
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // Create a new MongoClient instance in production
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  // Log successful connection in development
  clientPromise.then(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Connected to MongoDB successfully");
    }
  }).catch((error) => {
    console.error("MongoDB connection error:", error);
    throw error;
  });
} catch (error) {
  console.error("Failed to initialize MongoDB client:", error);
  throw error;
}

// Export the module-scoped MongoClient promise
export default clientPromise;
