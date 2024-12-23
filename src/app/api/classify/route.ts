// @ts-ignore
import { classifyImage } from "@/lib/classifier";

    import { NextResponse, NextRequest } from "next/server";

    import { StreamingTextResponse } from "ai";



    // Set the runtime to edge for best performance

    export const runtime = "edge";



    // add a listener to POST requests

    export async function POST(request: NextRequest) {

      // read our file from request data

      const data = await request.formData();

      const file: File | null = data.get("file") as unknown as File;



      if (!file) {

        return NextResponse.json(

          { message: "File not present in body" },

          { status: 400, statusText: "Bad Request" }

        );

      }



      //call our classify function and stream to the client

      const response = await classifyImage(file);

      return new StreamingTextResponse(response);

}
