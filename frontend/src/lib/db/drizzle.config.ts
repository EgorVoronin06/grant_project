import { type Config } from 'drizzle-kit';
import config from './db-config';

export default {
	dialect: 'postgresql',
	schema: './src/lib/db/entities/*.entity.ts',
	dbCredentials: {
		host: config.dbHost,
		port: +config.dbPort,
		database: config.dbName,
		user: config.dbUser,
		password: config.dbPassword
	},
	out: './migrations',
	verbose: true,
	strict: true
} satisfies Config;
