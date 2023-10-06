require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/build")));
}

app.listen(port, () => console.log(`Server running on port ${port}`));



app.use("/plan", require("./routes/plan"));
app.use("/user", require("./routes/user"))
app.use("/auth", require("./routes/auth"))

if (process.env.NODE_ENV === "production") {
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
    });
}
