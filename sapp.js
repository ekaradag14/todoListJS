const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todoDB",{ useNewUrlParser: true ,  useUnifiedTopology: true });
