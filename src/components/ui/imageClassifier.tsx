"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface ImageClassifierProps {
  onClassification: (description: string, file: File) => void;
}

export const cleanResponse = (rawResponse: string) => {
    return rawResponse
      .replace(/^\d+:\s*/gm, "")
      .replace(/\\n/g, "\n")
      .replace(/"/g, "")
      .replace(/(\w)-\s+(\w)/g, "$1$2")
      .replace(/([a-zA-Z])([A-Z])/g, "$1 $2")
      .replace(/(\w)([A-Z][a-z])/g, "$1 $2")
      .replace(/\s+([.,!?;:])/g, "$1")
      .replace(/\s\s+/g, " ")
      .trim();
  };


export default function ImageClassifier({ onClassification }: ImageClassifierProps) {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inputKey, setInputKey] = useState(new Date().toString());

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", file as File);
    
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseText = await res.text();

      // const reader = res.body?.getReader();
      // const decoder = new TextDecoder("utf-8");
      // let content = "";

      // while (true) {
      //   const { done, value } = await reader!.read();
      //   if (done) break;
      //   content += decoder.decode(value, { stream: true });
      // }

      // const cleanedResponse = cleanResponse(content);

      const cleanedResponse = responseText

      setResponse(cleanedResponse);
      onClassification(cleanedResponse, file as File);
    } catch (error) {
      console.error("Error processing image:", error);
      setResponse("An error occurred while processing the image.");
    }
  };

  
  const onReset = () => {
    setFile(null);
    setImage(null);
    setResponse("");
    setSubmitted(false);
    setInputKey(new Date().toString());
  };

  return (
    <div className="max-w-4xl">
      {image && (
        <img
          src={image}
          alt="An image to classify"
          className="mb-8 max-w-xs max-h-60 object-contain"
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          key={inputKey}
          type="file"
          accept="image/jpeg"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) {
              setFile(files[0]);
              setImage(URL.createObjectURL(files[0]));
            } else {
              setFile(null);
              setImage(null);
            }
          }}
        />
        <p className="py-8 text-slate-800">
          {submitted && !response ? "AI examination of crime scene evidence loading..." : response}
        </p>
        <div className="flex flex-row">
          <Button
            type="submit"
            disabled={submitted || !file}
          >
            Classify Image
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
