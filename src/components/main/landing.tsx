"use client"

import { useState, useEffect } from "react";
import { getScenes } from "@/server/actions/scene";
import { AddSceneDialog } from "./addSceneDialog";
import { ResultDisplay } from "./resultDisplay";
import Link from 'next/link';
import { Scene } from "@/server/db/types";
import { useSDK } from "@metamask/sdk-react";
import { getImageHashFromUrl } from "@/utils/imagehash";

export function Landing({ userName }: { userName: string | undefined }) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<Scene[]>([]);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const [account, setAccount] = useState<string | undefined>();
  const {sdk, connected, connecting } = useSDK();

  useEffect(() => {
    const checkAccount = async () => {
      if (connected) {
        try {
          const accounts = await sdk?.connect();
          setAccount(accounts[0]);
        } catch (err) {
          console.error("Failed to get accounts", err);
          setAccount(undefined);
        }
      } else {
        setAccount(undefined);
      }
    };

    checkAccount();
  }, [sdk, connected]);

  const fetchScenes = async () => {
    try {
      const fetchedScenes = await getScenes();
      setScenes(fetchedScenes);
      
      await Promise.all(fetchedScenes.map(scene => new Promise<void>(async (resolve, reject) => {
      
        const calculatedImageHash = await getImageHashFromUrl(scene.imageUrl!);
        console.log('url hash', calculatedImageHash)
        console.log('image hash', scene.imageHash)
        
      })))
      
      console.log('fetchScenes');

    } catch (error) {
      console.error("Error fetching scenes:", error);
    }

  };

  useEffect(() => {
    fetchScenes();
  }, []);

  const toggleSceneSelection = (scene: Scene) => {
    setSelectedScenes(prevSelected => 
      prevSelected.some(s => s.id === scene.id)
        ? prevSelected.filter(s => s.id !== scene.id)
        : [...prevSelected, scene]
    );
  };

  const sendSelectedScenes = async () => {
    const descriptions = selectedScenes.map(scene => scene.description).filter(Boolean) as string[];

    try {
      const res = await fetch("/api/compare", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriptions }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseText = await res.text();
      setComparisonResult(responseText);
    } catch (error) {
      console.error("Error comparing scenes:", error);
      setComparisonResult("An error occurred while comparing scenes.");
    }
  };

  const handleBackToLanding = () => {
    setComparisonResult(null);
    setIsCompareMode(false);
    setSelectedScenes([]);
  };

  if (!userName) {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to Scene Creator</h1>
        <p className="text-xl">Please log in to start creating scenes.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-6xl px-4 py-1 flex flex-col items-center justify-center">
        {comparisonResult ? (
          <ResultDisplay result={comparisonResult} onBack={handleBackToLanding} />
        ) : (
          <>
            <div className="mb-2">
              <img src="/templogoglow.png" alt="Temporary Logo" className="w-30 h-30 object-contain mb-2" />
              <img src="/midshieldwords.png" alt="Midshield words" className="w-50 h-50 object-contain mb-2" />
            </div>
            <div className="mb-20">
              <AddSceneDialog onSceneAdded={fetchScenes} account={account} />
            </div>
            <h2 className="text-3xl font-bold mb-6">Your Scenes</h2>
            <div className="mb-6 flex space-x-4">
              {!isCompareMode && (
                <button 
                  onClick={() => setIsCompareMode(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Compare Scenes
                </button>
              )}
              {isCompareMode && (
                <>
                  <button 
                    onClick={sendSelectedScenes}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={selectedScenes.length < 2}
                  >
                    Confirm Compare
                  </button>
                  <button 
                    onClick={() => {
                      setIsCompareMode(false);
                      setSelectedScenes([]);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map((scene) => (
                <div key={scene.id} className="relative">
                  <Link href={`/scene/${scene.id}`} className="block">
                    <div className={`border rounded-lg shadow-md overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105 ${
                      isCompareMode && selectedScenes.some(s => s.id === scene.id) ? 'border-blue-500 border-2' : ''
                    }`}>
                      {scene.imageUrl && (
                        <img src={scene.imageUrl} alt={scene.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4 bg-[#2C3755]">
                        <h3 className="text-xl font-semibold mb-2">{scene.title}</h3>
                        {scene.description && (
                          <p className="mb-2 line-clamp-2">{scene.description}</p>
                        )}
                        {scene.date && (
                          <p className="text-sm">Date: {new Date(scene.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  {isCompareMode && (
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSceneSelection(scene);
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedScenes.some(s => s.id === scene.id)}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
