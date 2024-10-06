const { gemini } = require('./chatmodel.js')

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

	const { prompt } = JSON.parse(event.body);
	const response = await gemini(prompt);

	return {
		statusCode: 200,
		body: JSON.stringify(response)
	}
}