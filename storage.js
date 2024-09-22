const { createConnection } = require('mysql2/promise')

const connectionPromise = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	dateStrings: true
})

function getConnection() {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const connection = await connectionPromise;
			resolve(connection);
		}, 1000);
	});
}

exports.insert = async (post) => {
	await getConnection()
		.then(async connection => {
			await connection.execute(
				'INSERT INTO post (userid, title, content, created, modified) VALUES (?, ?, ?, CURRENT_TIMESTAMP(), NULL)',
				[post.userId, post.title, post.content]
			)
		})
		.catch(error => {
			if (/Duplicate entry/.test(error.message)) return false
			throw error;
		})

	return true;
}

exports.select = async (postId) => {
	const post = await getConnection()
		.then(async connection => {
			const rows = await connection.execute(
				'SELECT * FROM post WHERE postid = ?',
				[postId]
			);

			const row = rows[0][0] ?? [];
			if (!row) return null;

			return {
				postId: row['postid'],
				userId: row['userid'],
				title: row['title'],
				content: row['content'],
				created: row['created'],
				modified: row['modified']
			}
		})
		.catch(error => {
			console.log(error);
		})

	return post;
}

exports.update = async (postId, newPost) => {
	const response = await getConnection()
		.then(async connection => {
			const ok = await connection.execute(
				'UPDATE post SET title = ?, content = ?, modified = CURRENT_TIMESTAMP() WHERE postid = ?',
				[newPost.title, newPost.content, postId]
			)
			return ok[0];
		})
		.catch(error => {
			console.log(error);
		})
		
	return response.affectedRows === 1;
}

exports.remove = async (postId) => {
	await getConnection()
		.then(async connection => {
			await connection.execute(
				'DELETE FROM post WHERE postid = ?',
				[postId]
			)
		})
		.catch(error => {
			console.log(error);
		})
}

exports.list = async () => {
	const posts = await getConnection()
		.then(async connection => {
			const rows = await connection.execute(
				'SELECT * FROM post ORDER BY created DESC'
			)

			return (rows[0] ?? []).map(row => ({
				postId: row['postid'],
				userId: row['userid'],
				title: row['title'],
				content: row['content'],
				created: row['created'],
				modified: row['modified']
			}))
		})
		.catch(error => {
			console.log(error);
		})

	return posts;
}