import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/main/navbar";
import { Landing } from "@/components/main/landing";
import ImageClassifier from "@/components/ui/imageClassifier";
import ExampleComponent from "@/components/main/ExampleComponent";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata.full_name || user?.email;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userName={userName} />
      <div className="ml-60"> {/* This adds a left margin to move the ExampleComponent to the right */}
        <ExampleComponent />
      </div>
      <div className="flex-grow">
        <Landing userName={userName} />
      </div>
    </div>
  );
}
