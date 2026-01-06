/**
 * @param {string} date
 * @param {boolean} noTime
 */

export function formatDateTime(date, noTime = false) {
	if (typeof date !== 'string') return;

	let res;

	if (noTime) {
		res = new Date(date)
			.toLocaleString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
	} else {
		res = new Date(date)
			.toLocaleString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
	}

	return res.split(',').join('');
}
