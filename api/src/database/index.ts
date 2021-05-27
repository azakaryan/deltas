const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONGO_CLUSTER } = process.env;

export const dbConnection = {
  url: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?replicaSet=${MONGO_CLUSTER}&retryWrites=false`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
