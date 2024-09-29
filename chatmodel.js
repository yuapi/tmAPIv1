const { GoogleGenerativeAI } = require('@google/generative-ai')
const OpenAI = require('openai')

// const genAI = new GoogleGenerativeAI(process.env.google_api_key)
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const { chat } = require('./config.json');
const openai = new OpenAI({ apiKey: chat.openai_key });

exports.gemini = async (prompt) => {
	console.log(prompt)
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

exports.gpt = async (prompt, model="gpt-3.5-turbo") => {
	const completion = await openai.chat.completions.create({
		model: model,
		messages: [
			{
				role: "user",
				content: prompt
			}
		]
	})

	return completion
}