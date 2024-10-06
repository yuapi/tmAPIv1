const { userdb } = require('./storage.js');

exports.createUser = async (event) => {
	if (!event.body) return { statusCode: 404 };

	const { user } = JSON.parse(event.body);
	
	const res = await userdb.insert(user);
	if (!res) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ res, user })
	};
}

exports.readUser = async (event) => {
	if (!event.pathParameters || !event.pathParameters["id"]) return { statusCode: 404 };

	const user = await userdb.select(event.pathParameters.id);
	if (!user) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify(user)
	};
}

exports.updateUser = async (event) => {
	if (!event.body || !event.pathParameters || !event.pathParameters["id"]) return { statusCode: 404 };

	const id = event.pathParameters.id;
	const { nickname, gender, birthday } = JSON.parse(event.body);

	if (!(await userdb.update(id, { nickname, gender, birthday }))) return { statusCode: 400 };

	return {
		statsuCode: 200,
		body: JSON.stringify({ id })
	};
}

exports.deleteUser = async (event) => {
	if (!event.pathParameters || !event.pathParameters["id"]) return { statusCode: 404 };

	await userdb.remove(event.pathParameters.id);

	return { statusCode: 200 };
}