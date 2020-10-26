//new
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const ShrotUrl = require("../models/shortUrl");
const ViewCount = require("../models/viewCount");
const shortid = require("shortid");

router.post("/increaseViewCount", async (req, res) => {
  try {
    //console.log('inside viewCount');
    // const increment = await ViewCount.findByIdAndUpdate({name:"noOfViews"},{ $inc: { counts: 1 } });
    // //increment.save();
    // // const q = new ViewCount({
    // //   counts: 1
    // // });
    // // q.save();
    // console.log(increment);
    // console.log('done');



  const q = await ViewCount.findOne({ name: 'noOfViews' });
  // if (shortUrl == null) return res.sendStatus(401);
  if (q == null) return res.json({ found: false });
  // console.log(q);
  // console.log(q.counts);
  q.counts++;
  q.save();
  // console.log(q.counts);
  res.json({"totalNumberOffCounts":q.counts});
  console.log('incremented count');

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    // validate

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //   ShortUrl.find({email:email})
    //   .then((doc)=>{
    //     //myURLS=doc;
    //     //console.log(myURLS);
    //   })
    //  .catch((err)=>{
    //      console.log(err);
    //  });
    const myURLS = await ShortUrl.find({ email: email });
    //console.log(myURLS)

    // console.log("-----------email inside /login----------");
    // console.log(user.email);
    // const myLinks = ShrotUrl.find({email:email})
    // console.log("-----------inside /login----------");
    // console.log(myLinks);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        links: myURLS,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteUser", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    // console.log("--------------------------");
    // console.log(user);
    // console.log("-----------email---------------");
    // console.log(user.email);
    const myLinks = await ShrotUrl.find({ email: user.email });
    res.json({
      displayName: user.displayName,
      id: user._id,
      email: user.email,
      myLinks: myLinks,
    });
  } catch (error) {
    console.log("error in catch");
  }
});

router.post("/quick", async (req, res) => {
  try {
    const { full, email } = req.body;

    const existingFullUrl = await ShortUrl.findOne({ full: full });
    if (existingFullUrl)
      return res.status(400).json({ msg: "This url is already shortened" });

    const newQuick = new ShrotUrl({
      full: full,
      short: shortid.generate(),
      email: email,
    });
    const generatedQuick = await newQuick.save();
    console.log(generatedQuick);

    res.json(generatedQuick);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/custom", auth, async (req, res) => {
  try {
    const { full, short, email, title } = req.body;

    if (!full) return res.status(400).json({ msg: "Enter a valid full link" });

    if (!full) return res.status(400).json({ msg: "Enter a valid title" });

    const existingFullUrl = await ShortUrl.findOne({ full: full });
    if (existingFullUrl)
      return res.status(400).json({ msg: "This url is already shortened" });

    const existingShortUrl = await ShortUrl.findOne({ short: short });
    if (existingShortUrl)
      return res
        .status(400)
        .json({ msg: "Shortened url already exists , try another one" });

    //console.log(req.body);
    const newQuick = new ShortUrl({
      full: full,
      short: short,
      email: email,
      title: title,
    });
    const generatedQuick = await newQuick.save();
    res.json({ addedLink: newQuick, status: "added succesfully" });
    console.log(newQuick);
    // return res
    //     .status(200)
    //     .json({ msg: "added" });
  } catch (err) {
    const m = err.message;
    res.status(500).json({ msg: m });
  }
});

router.post("/deleteCustom", auth, async (req, res) => {
  try {
    const email = req.body.email;
    console.log("--------before req.body------------");
    console.log(req.body.email);
    console.log(req.body.short);
    //console.log('q');
    //res.json("done");

    const checkCustom = await ShortUrl.findOne({ short: req.body.short });
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzz");
    console.log(checkCustom);
    if (checkCustom != null) {
      if (checkCustom.email == req.body.email) {
        const deleted = await ShortUrl.findByIdAndDelete(checkCustom._id);
        console.log(deleted);
        console.log("deleted");
        return res.status(200).json({ msg: "deleted" });
      } else {
        console.log("this does not belongs to u");
        return res.status(400).json({ msg: "this does not belongs to u" });
      }
    } else {
      return res.status(400).json({ msg: "this url is not found" });
    }
    //return res.status(400).json({ msg: "This url is already shortened" });
    // console.log("ckeckcustom is");
    // console.log(checkCustom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:shortUrl", async (req, res) => {
  console.log("inside short url");

  console.log(req.params.shortUrl);

  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  // if (shortUrl == null) return res.sendStatus(401);
  if (shortUrl == null) return res.json({ found: false });
  console.log(shortUrl);
  shortUrl.clicks++;
  shortUrl.save();
  res.json({ fullUrl: shortUrl.full, title: shortUrl.title, found: true });
  //res.redirect(shortUrl.full);
});


module.exports = router;
