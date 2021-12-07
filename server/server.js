const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const mongoose = require("mongoose");

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
/*
const db = require("./config/connection");
*/

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/mernshopping",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
app.use("/images", express.static(path.join(__dirname, "../client/images")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

mongoose.connection.on("error", () => {
  console.log("Mongoose connection error");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
db.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
*/
