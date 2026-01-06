import { writable } from 'svelte/store';

export type Notification = {
	type: 'success' | 'error';
	message: string;
};

let timeout: NodeJS.Timeout;
const DEFAULT_DURATION = 3000;

function createNotification() {
	const { subscribe, set, update } = writable<Notification | undefined>(undefined);
	function push(notification: Notification, duration: number) {
		clearTimeout(timeout);
		update(() => notification);
		timeout = setTimeout(() => set(undefined), duration);
	}
	return {
		subscribe,
		success: (message: string, duration?: number) => {
			push({ message, type: 'success' }, duration || DEFAULT_DURATION);
		},
		error: (message: string, duration?: number) => {
			push({ message, type: 'error' }, duration || DEFAULT_DURATION);
		}
	};
}

export const notification = createNotification();
