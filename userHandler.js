const { userdb } = require('./storage.js');

exports.readUser = async (event) => {
	console.log(event)
	if (!event.cognitoPoolClaims) return { statusCode: 404 };
	console.log(event.cognitoPoolClaims.sub)
	const user = await userdb.select(event.cognitoPoolClaims.sub);
	console.log(user);
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