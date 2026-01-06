export async function load() {
	console.log('Redirecting to first lesson');
	return {
		redirect: {
			status: 307,
			location: '/lk/lessons/1'
		}
	};
}
