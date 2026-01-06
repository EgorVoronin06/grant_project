import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import Config from './drizzle.config';

const pool = new Pool({ ...Config.dbCredentials });

export const db = drizzle(pool);
