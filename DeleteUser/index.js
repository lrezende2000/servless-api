const { ObjectID } = require('mongodb');
const createMongoClient = require('../shared/mongoClient');

module.exports = async function (context, req) {
  const { id } = req.params;

  if (!id) {
    context.res = {
      status: 422,
      body: 'Provide a user id on params',
    };
    return;
  }

  const { client: MongoClient, closeConnectionFn } = await createMongoClient();
  const Users = MongoClient.collection('users');

  try {
    await Users.findOneAndDelete({ _id: ObjectID(id) });
    closeConnectionFn();
    context.res = {
      status: 200,
      body: 'User deleted successfully!',
    };
  } catch (error) {
    context.res = {
      status: 502,
      body: 'Error on delete user ' + id,
    };
  }
};