const { GoogleGenerativeAI } = require('@google/generative-ai')
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

async function createGoogleSession(userid, prev=null) {
	chatSession[userid] = model.startChat({ history: prev ?? [] })
	return true;
}

exports.google = async (prompt, prev=null) => {
	console.log(prompt)
	const genAI = new GoogleGenerativeAI(process.env.google_api_key)
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

	const result = await model.generateContent(prompt)
	const content = await result.response.text().replace(/\*/g, '')
	
	const now = new Date()
	const timestamp = `${now.getHours()}:${now.getMinutes()}`

	const response = {
		content: content,
		timestamp: timestamp,
		role: 'assistant'
	}
	return response
}

exports.bedrock = async (prompt, prev=null, model='anthropic.claude-3-haiku-20240307-v1:0') => {
	console.log(prompt);
	const client = new BedrockRuntimeClient();
	const body = {
		anthropic_version: "bedrock-2023-05-31",
		max_tokens: 1000,
		messages: prev ?? []
	}

	await body.messages.push({
		role: "user",
		content: [
			{
				type: "text",
				text: prompt
			}
		]
	});

	const input = {
		body: Buffer.from(JSON.stringify(body)),
		contentType: "application/json",
		accept: "application/json",
		modelId: model,
		trace: "ENABLED"
	}

	const command = new InvokeModelCommand(input);
	const result = await client.send(command);
	const decode = Buffer.from(result.body).toString();
	const data = JSON.parse(decode)

	const now = new Date()
	const timestamp = `${now.getHours()}:${now.getMinutes()}`

	const response = {
		content: data.content[0].text,
		timestamp: timestamp,
		role: 'assistant'
	}
	return response
}

// exports.gpt = async (prompt, model="gpt-3.5-turbo") => {
// 	const completion = await openai.chat.completions.create({
// 		model: model,
// 		messages: [
// 			{
// 				role: "user",
// 				content: prompt
// 			}
// 		]
// 	})

// 	return completion
// }