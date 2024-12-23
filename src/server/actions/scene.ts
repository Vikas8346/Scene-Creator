'use server'

import { createClient } from '@/utils/supabase/server';
import { db } from '@/server/db';
import { scenes } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Scene } from '../db/types';
import { calculateImageHash } from '@/utils/imagehash';


export async function createScene(formData: FormData) {
  const supabase = createClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateStr = formData.get('date') as string;
  const file = formData.get('file') as File;
  const imageHash = formData.get('imageHash') as string;

  if (!title || !file) {
    throw new Error('Title and file are required');
  }

  const date = dateStr ? new Date(dateStr) : new Date();
  const formattedDate = date.toISOString().split('T')[0];

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Generate a unique filename
    const fileName = `${Date.now()}_${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('scene-images')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('scene-images')
      .getPublicUrl(fileName);

    // Create new scene in the database
    const [newScene] = await db.insert(scenes).values({
      title,
      description,
      imageUrl: publicUrl,
      imageHash,
      userId: user.id,
      date: sql`${formattedDate}::date`,
    }).returning();

    // Revalidate the path to update the UI
    revalidatePath('/');

    return newScene;
  } catch (error: any) {
    console.error('Error in createScene:', error);
    throw new Error(error.message || 'An error occurred while creating the scene');
  }
}


export async function getScenes(): Promise<Scene[]>  {
  const supabase = createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Fetch scenes for the current user
    const userScenes = await db.query.scenes.findMany({
      where: eq(scenes.userId, user.id),
      orderBy: (scenes, { desc }) => [desc(scenes.createdAt)],
    });

    return userScenes;
  } catch (error: any) {
    console.error('Error in getScenes:', error);
    throw new Error(error.message || 'An error occurred while fetching scenes');
  }
}

export async function getSceneDetails(sceneId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('midwestcon_scenes')
    .select('*')
    .eq('id', sceneId)
    .single();

  if (error) {
    console.error("Error fetching scene:", error);
    return null;
  }

  return data;
}

