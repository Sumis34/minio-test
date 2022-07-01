// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

const Minio = require("minio");
require("dotenv").config();

const client = new Minio.Client({
  endPoint: "s3.noekrebs.ch",
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
});

const port = process.env.PORT || 8080;

// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://docs.min.io/docs/javascript-client-api-reference#presignedPutObject)
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require("express")();

server.get("/presignedUrl", (req, res) => {
  client.presignedPutObject("data", req.query.name, (err, url) => {
    if (err) throw err;
    res.end(url);
  });
});

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

console.log("Listening on port " + port);
server.listen(port);
