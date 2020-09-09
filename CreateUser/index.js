const createMongoClient = require('../shared/mongoClient');

module.exports = async function (context, req) {
  const user = req.body || {};

  if (user) {
    context.res = {
      status: 422,
      body: 'User is required',
    };
  }

  const { client: MongoClient, closeConnectionFn } = await createMongoClient();
  const Users = MongoClient.collection('users');

  try {
    const users = await Users.insert(user);
    closeConnectionFn();
    context.res = { status: 201, body: users.ops[0] };
  } catch (error) {
    context.res = {
      status: 502,
      body: 'Error on insert user',
    }; 
  }
};