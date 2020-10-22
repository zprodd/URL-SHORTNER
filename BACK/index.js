const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// set up express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

// set up mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// set up routes
//app.use("/Dashboard", require("./routes/dashboard"));
// app.get("/:shortUrl", async (req, res) => {
//   console.log(req.params.shortUrl);

//   const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
//   if (shortUrl == null) return res.sendStatus(401);
//   console.log(shortUrl);
//   shortUrl.clicks++;
//   shortUrl.save();

//   //res.redirect(shortUrl.full);
//   res.json({short:shortUrl.short,full:shortUrl.full,title:shortUrl.title});
// });

app.use("/users", require("./routes/userRouter"));