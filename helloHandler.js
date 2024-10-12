exports.hello = async (event) => {
  console.log(event.cognitoPoolClaims);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};