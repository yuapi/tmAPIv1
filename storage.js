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

exports.postdb = {
	insert: async (post) => {
		await getConnection()
			.then(async connection => {
				await connection.execute(
					'INSERT INTO post (userid, title, content, created, modified) VALUES (?, ?, ?, CURRENT_TIMESTAMP(), NULL)',
					[post.userid, post.title, post.content]
				);
				await connection.end();
			})
			.catch(error => {
				if (/Duplicate entry/.test(error.message)) return false
				throw error;
			})
	
		return true;
	},
	select: async (id) => {
		const post = await getConnection()
			.then(async connection => {
				const rows = await connection.execute(
					'SELECT * FROM post WHERE id = ?',
					[id]
				);
				await connection.end();
	
				const row = rows[0][0] ?? [];
				if (!row) return null;
	
				return {
					id: row['id'],
					userid: row['userid'],
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
	},
	update: async (id, newPost) => {
		const response = await getConnection()
			.then(async connection => {
				const ok = await connection.execute(
					'UPDATE post SET title = ?, content = ?, modified = CURRENT_TIMESTAMP() WHERE id = ?',
					[newPost.title, newPost.content, id]
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
					'DELETE FROM post WHERE id = ?',
					[id]
				);
				await connection.end();
			})
			.catch(error => {
				console.log(error);
			})
	},
	list: async () => {
		const posts = await getConnection()
			.then(async connection => {
				const rows = await connection.execute(
					'SELECT * FROM post ORDER BY created DESC'
				);
				await connection.end();
	
				return (rows[0] ?? []).map(row => ({
					id: row['id'],
					userid: row['userid'],
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
}

exports.userdb = {
	insert: async (user) => {
		await getConnection()
			.then(async connection => {
				await connection.execute(
					'INSERT INTO user (id, nickname, email, gender, birthday, regdate) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())',
					[user.id, user.nickname, user.email, user.gender, user.birthday]
				);
				await connection.end();
			})
			.catch(error => {
				if (/Duplicate entry/.test(error.message)) return false
				throw error;
			})

		return true;
	},
	select: async (id) => {
		const user = await getConnection()
			.then(async connection => {
				const rows = await connection.execute(
					'SELECT * FROM user WHERE id = ?',
					[id]
				);
				await connection.end();

				const row = rows[0][0] ?? [];
				if (!row) return null;

				return {
					id: row['id'],
					nickname: row['nickname'],
					email: row['email'],
					gender: row['gender'],
					birthday: row['birthday'],
					regdate: row['regdate']
				}
			})
			.catch(error => {
				console.log(error);
			})

		return user;
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
	select: async (name) => {
		const country = await getConnection()
			.then(async connection => {
				const rows = await connection.execute(
					'SELECT * FROM country WHERE name = ?',
					[name]
				);
				await connection.end()

				const row = rows[0][0] ?? [];
				if (!row) return null;

				return row
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