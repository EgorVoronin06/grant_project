export default function debounce(fn: (...args: unknown[]) => void, ms: number) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	return function (this: unknown, ...args: unknown[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
}
