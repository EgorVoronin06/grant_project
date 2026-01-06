export default function paginate(count: number, limit: number = 2) {
	return Math.ceil(count / limit);
}
