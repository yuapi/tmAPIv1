const { createPool } = require('mysql2/promise')

const pool = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	dateStrings: true,
	waitForConnections: true,
	connectionLimit: 12,
	queueLimit: 0
})

async function executeQuery(sql, params=[]) {
	let conn;
	try {
		conn = await pool.getConnection();
		const [results] = await conn.query(sql, params);
		return results;
	} catch (error) {
		console.error('Error from executing query:', error);
		throw error;
	} finally {
		if (conn) conn.release();
	}
}

exports.postdb = {
	insert: async (post) => {
		try {
			const results = await executeQuery(
				'INSERT INTO post (userid, title, content, created, modified) VALUES (?, ?, ?, CURRENT_TIMESTAMP(), NULL)', 
				[post.userid, post.title, post.content]
			);
			console.log(results);
			return results.insertId;
		} catch (error) {
			console.error('Error from postdb.insert:', error);
		}
	},
	select: async (id) => {
		try {
			const results = await executeQuery('SELECT post.*, user.nickname AS author FROM post INNER JOIN user ON post.userid = user.id WHERE post.id = ?', [id]);
			console.log(results);
			return results[0];
		} catch (error) {
			console.error('Error from postdb.select:', error);
		}
	},
	update: async (id, userid, newPost) => {
		try {
			const results = await executeQuery('UPDATE post SET title = ?, content = ?, modified = CURRENT_TIMESTAMP() WHERE id = ? AND userid = ?', [newPost.title, newPost.content, id, userid]);
			console.log(results);
			return results.affectedRows === 1;
		} catch (error) {
			console.error('Error from postdb.update:', error);
		}
	},
	remove: async (id, userid) => {
		try {
			const results = await executeQuery('DELETE FROM post WHERE id = ? AND userid = ?', [id, userid]);
			console.log(results);
			return results.affectedRows === 1;
		} catch (error) {
			console.error('Error from postdb.remove:', error);
		}
	},
	list: async () => {
		try {
			const results = await executeQuery('SELECT post.id, post.userid, user.nickname AS author, post.title, post.created FROM post INNER JOIN user ON post.userid = user.id ORDER BY post.id DESC');
			console.log(results);
			return results;
		} catch (error) {
			console.error('Error from postdb.list:', error);
		}
	}
}

exports.commentdb = {
	insert: async (comment) => {
		try {
			const results = await executeQuery(
				'INSERT INTO comment (postid, userid, content, created) VALUES (?, ?, ?, CURRENT_TIMESTAMP())', 
				[comment.postid, comment.userid, comment.content]
			);
			console.log(results);
			return results.insertId;
		} catch (error) {
			console.error('Error from commentdb.insert:', error);
		}
	},
	list: async (postid) => {
		try {
			const results = await executeQuery('SELECT comment.id, user.nickname AS author, comment.content, comment.created FROM comment INNER JOIN user ON comment.userid = user.id WHERE comment.postid = ? ORDER BY comment.id DESC', [postid]);
			console.log(results);
			return results;
		} catch (error) {
			console.error('Error from commentdb.list:', error);
		}
	}
}

exports.userdb = {
	select: async (id) => {
		try {
			const results = await executeQuery('SELECT * FROM user WHERE id = ?', [id]);
			console.log(results);
			return results[0];
		} catch (error) {
			console.error('Error from userdb.select:', error);
		}
	},
	update: async (id, newUser) => {
		const response = await getConnection()
			.then(async connection => {
				const ok = await connection.execute(
					'UPDATE user SET nickname = ?, gender = ?, birthday = ? WHERE id = ?',
					[newUser.nickname, newUser.gender, newUser.birthday, id]
				);
				await connection.end();

				return ok[0];
			})
			.catch(error => {
				console.log(error);
			})

		return response.affectedRows === 1;
	},
	remove: async (id) => {
		await getConnection()
			.then(async connection => {
				await connection.execute(
					'DELETE FROM user WHERE id = ?',
					[id]
				);
				await connection.end();
			})
			.catch(error => {
				console.log(error);
			})
	}
}

exports.countrydb = {
	insert: async (countries) => {
		console.log(countries)
		await getConnection()
			.then(async connection => {
				await connection.query(
					'INSERT INTO country (name, description, continent) VALUES ?',
					[countries]
				);
				await connection.end();
			})
			.catch(error => {
				if (/Duplicate entry/.test(error.message)) return false
				throw error;
			})

		return true;
	},
	select: async (names) => {
		if (!names.length) return [];

		const country = await getConnection()
			.then(async connection => {
				const rows = await connection.query(
					'SELECT * FROM country WHERE name in (?)',
					[names]
				);
				await connection.end()

				return (rows[0] ?? [])
			})
			.catch(error => {
				console.log(error);
			})

		return country;
	},
	list: async() => {
		const countries = await getConnection()
			.then(async connection => {
				const rows = await connection.execute(
					'SELECT * FROM country'
				);
				await connection.end()

				return (rows[0] ?? [])
			})
			.catch(error => {
				console.log(error);
			})

		return countries;
	}
}