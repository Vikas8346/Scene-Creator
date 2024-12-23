import { compareScenes } from "@/lib/comparison";
import { NextResponse, NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";

// Set the runtime to edge for best performance
export const runtime = "edge";

// Add a listener to POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const descriptions: string[] | null = body.descriptions;

    if (!descriptions || !Array.isArray(descriptions)) {
      return NextResponse.json(
        { message: "Invalid or missing descriptions in request body" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    // Call our compare function and stream to the client
    const response = await compareScenes(descriptions);

    return new NextResponse(response)
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
