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
	if (!event.cognitoPoolClaims || !event.body) return { statusCode: 404 };

	const newUser = {
		nickname: event.body.nickname,
		gender: event.body.gender,
		birthday: event.body.birthday,
	}

	if (!(await userdb.update(event.cognitoPoolClaims.sub, newUser))) return { statusCode: 400 };

	return {
		statsuCode: 200,
		body: JSON.stringify({ id: event.cognitoPoolClaims.sub })
	};
}

exports.deleteUser = async (event) => {
	if (!event.cognitoPoolClaims) return { statusCode: 404 };

	await userdb.remove(event.cognitoPoolClaims.sub)

	return { statusCode: 200 };
}