exports.main = async function (event, context) {
  console.log('ROHIT:', event);
  return {
    statusCode: 200,
    body: 'Hello',
  };
};
