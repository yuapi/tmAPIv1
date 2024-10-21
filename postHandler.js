const { postdb } = require('./storage.js');

exports.createPost = async (event) => {
	if (!event.cognitoPoolClaims || !event.body) return { statusCode: 404 };

	const post = {
		userid: event.cognitoPoolClaims.sub,
		title: event.body.title,
		content: event.body.content,
	}

	const id = await postdb.insert(post);
	if (!id) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ id })
	};
}

exports.readPost = async (event) => {
	if (!event.cognitoPoolClaims || !event.path || !event.path["id"]) return { statusCode: 404 };

	const post = await postdb.select(event.path.id);
	if (!post) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify(post)
	};
}

exports.updatePost = async (event) => {
	if (!event.cognitoPoolClaims || !event.body || !event.path || !event.path["id"]) return { statusCode: 404 };

	const newPost = {
		title: event.body.title,
		content: event.body.content,
	}

	if (!(await postdb.update(event.path.id, event.cognitoPoolClaims.sub, newPost))) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ title })
	};
}

exports.deletePost = async (event) => {
	if (!event.cognitoPoolClaims || !event.path || !event.path["id"]) return { statusCode: 404 };

	if (!(await postdb.remove(event.path.id, event.cognitoPoolClaims.sub))) return { statusCode: 400 };

	return { statusCode: 200 };
}

exports.listPosts = async (event) => {
	const postList = await postdb.list();
	
	return {
		statusCode: 200,
		body: JSON.stringify({ postList: postList })
	};
}


