import { TIMEOUTSECONDS } from './config';

const timeout = function (s) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const AJAX = async function (url, uploadData = undefined) {
	try {
		const fetcher = uploadData
			? fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(uploadData),
			  })
			: fetch(url);

		const res = await Promise.race([fetcher, timeout(TIMEOUTSECONDS)]);

		const data = await res.json();

		//? for the ok in res.

		if (!res.ok) throw new Error(`${data.message} ${res.message}`);

		return data;
	} catch (error) {
		throw error;
	}
};

/* 
export const getJSON = async function (url) {
	try {
		const fetchPro = fetch(url);
		const res = await Promise.race([fetchPro, timeout(TIMEOUTSECONDS)]);

		const data = await res.json();

		//? for the ok in res.

		if (!res.ok) throw new Error(`${data.message} ${res.message}`);

		return data;
	} catch (error) {
		throw error;
	}
};
export const sendJSON = async function (url, uploadData) {
	try {
		const fetchPro = fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(uploadData),
		});
		const res = await Promise.race([fetchPro, timeout(TIMEOUTSECONDS)]);

		const data = await res.json();

		//? for the ok in res.

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data;
	} catch (error) {
		throw error;
	}
};
 */
