const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const Tiktok = require("./tiktok");

app.use(cors());

app.use(express.json());
app.use(express.static("public"));
app.set("json spaces", 2);

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/download", async function (req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });
    const tiktok = new Tiktok();
    const results = await tiktok.down(url);
    if (!results || results[0]?.downloadLinks.length === 0) {
      console.log("No media found.");
      res.status(404).json({ error: "No media found." });
      return;
    }
    const result = results[0]?.downloadLinks[0]?.link;
    return res.status(200).json({
      result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
