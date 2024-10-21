const { postdb } = require('./storage.js');

exports.createPost = async (event) => {
	if (!event.cognitoPoolClaims || !event.body) return { statusCode: 404 };

	const post = {
		userid: event.cognitoPoolClaims.sub,
		title: event.body.title,
		content: event.body.content,
	}

	const res = await postdb.insert(post);
	if (!res) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ res, title })
	};
}

exports.readPost = async (event) => {
	if (!event.path || !event.path["id"]) return { statusCode: 404 };

	const post = await postdb.select(event.path.id);
	if (!post) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify(post)
	};
}

exports.updatePost = async (event) => {
	if (!event.body || !event.pathParameters || !event.pathParameters["id"]) return { statusCode: 404 };

	const id = event.pathParameters.id;
	const { title, content } = JSON.parse(event.body);

	if (!(await postdb.update(id, { title, content }))) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ title })
	};
}

exports.deletePost = async (event) => {
	if (!event.pathParameters || !event.pathParameters["id"]) return { statusCode: 404 };

	await postdb.remove(event.pathParameters.id);

	return { statusCode: 200 };
}

exports.listPosts = async (event) => {
	const postList = await postdb.list();
	
	return {
		statusCode: 200,
		body: JSON.stringify({ postList: postList })
	};
}


