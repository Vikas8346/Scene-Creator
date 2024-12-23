import React from 'react';
import { cleanResponse } from '../ui/imageClassifier';

interface ResultDisplayProps {
  result: string;
  onBack: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onBack }) => {
  result = cleanResponse(result);
  return (
    <div className="w-full max-w-4xl mt-8 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Comparison Result:</h3>
        <button
          onClick={onBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Scenes
        </button>
      </div>
      <pre className="whitespace-pre-wrap  p-4 rounded">{result}</pre>
    </div>
  );
};
