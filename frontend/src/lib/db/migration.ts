import { Client } from 'pg';
import Config from './drizzle.config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const colors = {
	yellow: 33,
	red: 31,
	green: 32
};

type Color = keyof typeof colors;

function coloredLog(color: Color, value: string): void {
	console.log(`\x1b[${colors[color]}m${value}\x1b[0m`);
}

async function run() {
	const client = new Client({ ...Config.dbCredentials });
	try {
		await client.connect();
		coloredLog('yellow', 'Connection opened');
		const db = drizzle(client);
		coloredLog('yellow', 'Try migrations');
		await migrate(db, { migrationsFolder: 'migrations' });
		coloredLog('green', 'Migrations status - Success');
	} catch (error) {
		coloredLog('red', 'Migrations status - Failed');
		console.log(error);
	} finally {
		await client.end();
		coloredLog('yellow', 'Connection closed');
	}
}

run();
