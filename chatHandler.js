const { google, bedrock } = require('./chatmodel.js')

const models = ["gemini-1.5-flash", "claude-3-haiku"];

exports.getSession = async (event) => {
	return {
		statusCode: 200
	}
}

exports.createSession = async (event) => {
	return {
		statusCode: 200
	}
}

exports.deleteSession = async (event) => {
	return {
		statusCode: 200
	}
}

exports.chat = async (event) => {
	if (!event.body) return { statusCode: 404 };

	const { model, prompt, prev } = event.body;
	console.log(event.cognitoPoolClaims)
	const userid = event.cognitoPoolClaims.identities.userid;
	if (!model || models.indexOf(model) === -1) return { statusCode: 400 }

	let response;
	const modelNo = models.indexOf(model);

	if (modelNo === 0) {
		response = await google(prompt)
	} 
	else if (modelNo === 1) {
		response = await bedrock(prompt)
	}

	return {
		statusCode: 200,
		body: JSON.stringify(response)
	}
}