/** Global Utilities */
require("./src/utilities/globals");
const express = require("express");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const connectToDatabase = require("./src/data/dbConnectors");
const { ApolloServer } = require("apollo-server-express");
const expressMongoSanitize = require("express-mongo-sanitize");
const { loadEventSystem } = require("./src/events/_loader");
const { morganRequestMiddleware } = require("./src/utilities/logger");
const resolvers = require("./src/data/resolvers");
const { typeDefs } = require("./src/data/schema");
const rateLimit = require("express-rate-limit");

let PORT = process.env.APP_PORT || 4000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const app = express();
connectToDatabase();
loadEventSystem();

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morganRequestMiddleware);
app.use(expressMongoSanitize());
app.use(compression());
app.use("*", cors());
app.use(hpp());
/** REST Route Middleware */
app.use("/api/v1", require("./src/routes/_config"));
//app.use(limiter);

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: (request) => {
      return {
        ...request,
      };
    },
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.listen(PORT, () => {
    console.log(
      `🚀 Server Listening on PORT ${PORT} http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
}
startServer();
