import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/main/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getSceneDetails } from "@/server/actions/scene";


export default async function SceneDetail({ params }: { params: { sceneId: string } }) {
  const scene = await getSceneDetails(params.sceneId);
  console.log(scene);

  if (!scene) {
    notFound();
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata.full_name || user?.email;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userName={userName} />
      <main className="flex-grow  py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/">
            <Button variant="outline" className="mb-6">← Back to Scenes</Button>
          </Link>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={scene.image_url} alt={scene.title} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{scene.title}</h1>
              <p className="text-gray-600 mb-4">{scene.description}</p>
              <p className="text-sm text-gray-500">Created on: {new Date(scene.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
