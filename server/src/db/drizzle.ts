import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.NEON_DATABASE_URI!);
const db = drizzle(queryClient, { schema });

export default db;