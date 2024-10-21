const { commentdb } = require('./storage.js');

exports.createComment = async (event) => {
	if (!event.cognitoPoolClaims || !event.body) return { statusCode: 404 };

	const comment = {
		postid: event.body.postid,
		userid: event.cognitoPoolClaims.sub,
		content: event.body.content,
	}

	const id = await commentdb.insert(comment);
	if (!id) return { statusCode: 400 };

	return {
		statusCode: 200,
		body: JSON.stringify({ id })
	};
}

exports.listComments = async (event) => {
	if (!event.path || !event.path['pid']) return { statusCode: 404 };

	const commentList = await commentdb.list(event.path.pid);
	
	return {
		statusCode: 200,
		body: JSON.stringify({ commentList: commentList })
	};
}


