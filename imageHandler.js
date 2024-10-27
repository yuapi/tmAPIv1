const axios = require('axios');

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

let unsplashRequests = 0;
let lastResetTime = Date.now();
const UNSPLASH_LIMIT = 50;
const RESET_PERIOD = 3600000;

async function getImage(query) {
  if (Date.now() - lastResetTime >= RESET_PERIOD) {
    unsplashRequests = 0;
    lastResetTime = Date.now();
  }

  if (unsplashRequests < UNSPLASH_LIMIT) {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query },
        headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` }
      });
      unsplashRequests++;
      return response.data.results;
    } catch (error) {
      console.error('Unsplash API error:', error);
    }
  }

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: { key: PIXABAY_API_KEY, q: query }
    });
    return response.data.hits;
  } catch (error) {
    console.error('Pixabay API error:', error);
    throw error;
  }
}

exports.getImages = async (event) => {
	console.log(event)
	if (!event.cognitoPoolClaims || !event.body) return { statusCode: 404 };
	
	console.log(event.body.query);

	try {
		if (event.body.query.length < 3) throw new Error("최소 갯수 부족. 잘못된 요청");

		const images = []
		for (q in event.body.query) {
			const image = await getImage(q)
			images.push(image);
		}

		return {
			statusCode: 200,
			body: JSON.stringify(images)
		};
	} catch (error) {
		console.error(error);
		return { statusCode: 400 };
	}
}