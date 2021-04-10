const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/post/", require("./routes/post"));
app.use("/auth/", require("./routes/auth"));
app.use("/user/", require("./routes/user"));

app.listen(5000, () => {
  const mongoose = require("mongoose");
  mongoose
    .connect(
      `mongodb+srv://tiqu:${process.env.MONGODB_PASS}@cluster0.qhzyc.mongodb.net/cluster0?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(() => console.log("Succesfully connected to the database..."))
    .catch((err) => console.log(err));
});
