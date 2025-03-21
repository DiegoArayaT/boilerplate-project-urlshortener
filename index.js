require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Permite leer datos de formularios


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

let urlsDatabase = [];

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  try {
    const parsedUrl = new URL(originalUrl);
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }
      const shortUrl = urlsDatabase.length + 1;

      urlsDatabase.push({ original_url: originalUrl, short_url: shortUrl });

      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (e) {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shortUrl = parseInt(req.params.shorturl);
  const foundUrl = urlsDatabase.find((entry) => entry.short_url === shortUrl);

  return res.redirect(foundUrl.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
