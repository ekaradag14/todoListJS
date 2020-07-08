const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();
// burada hazırladığım kalıp fonksiyonu çağırıyorum
// const date = require(__dirname + "/date.js");
app.use(bodyParser.urlencoded({
  extended: true
}));


// Burada app e diyorumki view engine olarak EJS kullan. EJS kullanabilmek için gerekli.
app.set('view engine', 'ejs');
// bodyparser kullanma metodu req.body.newListItem 'u kullanmak için gerekli
app.use(express.static("public"));

// PROJECT STORAGE
let newItems = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];
let workLists = [];

// MongoDB SCHEMAS



const workListSchema = new mongoose.Schema({
  listTitle: {
    type: String
  }

});



const choreSchema = new mongoose.Schema({
  content: {
    type: String
  },
  motherList: workListSchema
});
const Chore = mongoose.model("Chore", choreSchema);
const WorkList = mongoose.model("WorkList", workListSchema);





app.get("/", function(req, res) {
  res.redirect("/home");
});
app.get("/home", function(req, res) {
  // burada export ile hazırladığım kalıbın istediğim fonksiyonuna ulaşıyorum
  // Burada EJS kullanarak list.ejs e letiable gönderiyorum
  res.render("list", {
    listTitle: "Main List",
    newListTableItems: newItems
  });
});

app.post("/", function(req, res) {

  console.log("New List Item Adding Request To Anonymus List Taken.");
  let item = req.body.newListItem
  let motherItem = WorkList.findOne({
    "listTitle": req.body.button
  },function(err,foundData){
    console.log(foundData._id);
    return foundData
  });

  const gottaDo = new Chore({
    content: item,
    motherList: motherItem
  });
  gottaDo.save();

  res.redirect("/" + req.body.button)

});

// Burada html sayfasına data gönderiyorum. Çalışması için bodyparser a ihtiyacı var.


app.get("/:title", function(req, res) {

      if (workLists.indexOf("workLists") === -1) {

        let title = String(req.params.title)
        // console.log(":/title alanı" + title);
        if (title != "favicon.ico"){ // BURAYI SOR TITLE OLARAK IKI DATA GELIYOR BIRI FAVICON

        const newList = new WorkList({
          listTitle: title
        })
        newList.save();

        }

        res.render("list", {
          listTitle: (title + " List"),
          newListTableItems: []
        });

      } else {
        console.log("In else statement");
        if (title != "favicon.ico"){

      var itesm =  Chore.find({
          "motherlist": req.params.title
        }, function(err, data) {
          if (err) {
            err.status = 406;
            return next(err);
          } else {
            console.log("In Mapping stat");
            data.map(val => {
              workItems.push(val);
              console.log("Work Items in the parantez" + workItems);
            });
            console.log(workItems);
            return data
            }

          });
  }

          console.log("Refresh");
          res.render("list", {

            listTitle: (req.params.title + " List"),
            newListTableItems: itesm
          });


}
});

app.post("/delete", function(req,res){
  console.log(req.body.checkbox);

})





        app.listen(3000, function() {
          console.log("Server started successfuly on port 3000!")
        })

        // const gottaDo = new Chore ({
        // content: "Show DB!",
        // motherList: "mother"
        // });

        // gottaDo.save();


        //  Burada kullanıcı form ile bir post request yaptığında neler olacağını yazıyorum
        // app.post("/", function(req, res) {
        //   let item = req.body.newListItem
        //   // burada isteğin hangi button dan geldiğine bakıyorum ve ona göre yönlendirme yapıyorum
        //   // if (req.body.button === "Work") {
        //   //   workItems.push(item);
        //   //   console.log(workItems);
        //   //   res.redirect("/work");
        //   // } else {
        //   //   // text area dan gelen item ı listimi populate etmek için kullandığım alana yazıyorum.
        //   //   console.log(req.body);
        //   //   newItems.push(item);
        //   //   console.log(newItems);
        //   //   console.log("Bura trigger");
        //   //   // burada da home route a redirect ediyorum çünkü güncellenmiş array ile yeniden oluşturulacak liste
        //   //   res.redirect("/");
        //   // }
        // console.log("Buraya mı girdin?");
        //
        // });
