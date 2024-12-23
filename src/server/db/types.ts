import { InferSelectModel } from 'drizzle-orm';
import { scenes } from './schema';

export type Scene = InferSelectModel<typeof scenes>