const express = require("express")
const app = express()
const fs = require("fs");
const cors = require("cors");
const https = require('https')
const port = 3000
const path = require("path");

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"))
app.use("/static", express.static("../build"))

app.get("/extension/changelog", (req, res) => {
    res.sendFile(path.join(__dirname, "/CHANGELOG.md"));
})

app.listen(port, function () {
    console.log('Dev Server Running and Listening')
})