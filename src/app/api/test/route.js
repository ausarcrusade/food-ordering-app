import { mongooseConnect } from "@/lib/mongoose";

export async function GET() {
  try {
    await mongooseConnect();
    return Response.json({ status: "Connected to MongoDB!" });
  } catch (error) {
    return Response.json({ 
      status: "Failed to connect", 
      error: error.message 
    }, { status: 500 });
  }
} 
// Attempts to connect to the MongoDB database
// Returns a JSON response with a status message
// Throws an error if the connection fails
// visit http://localhost:3000/api/test to test the connection
