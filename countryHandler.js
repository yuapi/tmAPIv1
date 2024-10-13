const { devOnlyKey } = require('./config.json');
const { countrydb } = require('./storage.js');

exports.createCountry = async (event) => {
	// Dev Only Authorization
	if (!event.headers.devKey || event.headers.devKey != devOnlyKey) return { statusCode: 502 };

	if (!event.body) return { statusCode: 404 };

	const { countries } = JSON.parse(event.body)
	if (!countries || countries?.length < 1) return { statusCode: 400 };

	const res = await countrydb.insert(countries);
	if (!res) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: "Success"
	};
}

exports.readCountry = async (event) => {
	if (!event.query || !event.query["name"]) return { statusCode: 404 };

	const country = await countrydb.select(event.query.name);
	if (!country) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify(country),
	};
}