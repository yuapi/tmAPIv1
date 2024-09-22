const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.google_api_key)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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