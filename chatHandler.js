const { google, bedrock, perplexity, openai } = require('./chatmodel.js')

const models = ["Gemini-1.5-flash", "Claude-3-haiku", "Sonar", "GPT-4o"];

exports.chat = async (event) => {
	if (!event.body) return { statusCode: 404 };

	const { model, prompt, prev } = event.body;
	console.log(event.cognitoPoolClaims)
	const userid = event.cognitoPoolClaims.sub;
	if (!model || models.indexOf(model) === -1) return { statusCode: 400 }

	let response;
	const modelNo = models.indexOf(model);

	if (modelNo === 0) {
		response = await google(prompt)
	} 
	else if (modelNo === 1) {
		response = await bedrock(prompt)
	}
	else if (modelNo === 2) {
		response = await perplexity(prompt)
	}
	else if (modelNo === 3) {
		response = await openai(prompt)
	}

	return {
		statusCode: 200,
		body: JSON.stringify(response)
	}
}