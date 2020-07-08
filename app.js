const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-erencan:XXXXXXX @cluster0.efw9y.mongodb.net/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin-erencan: XXXXXXX @cluster0.efw9y.mongodb.net/todoDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });





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

const choreSchema = new mongoose.Schema({
  content: {
    type: String
  },

});

const workListSchema = new mongoose.Schema({
  listTitle: {
    type: String
  },
listItems: [choreSchema]
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
  // let motherItem = WorkList.findOne({
  //   "listTitle": req.body.button
  // },function(err,foundData){
  //   console.log(foundData._id);
  //   return foundData
  // });

  const gottaDo = new Chore({
    content: item,
  });


  // console.log(String(req.body.button));
  WorkList.findOne({"listTitle": String(req.body.button)}, function(err, data) {
       if (err) {
         err.status = 406;
         return next(err);
       } else {
         const gottaDo = new Chore({
           content: req.body.newListItem,
         });

data.save();
data.listItems.push(gottaDo);

gottaDo.save();

   // console.log(data.listItems);
  res.redirect("/" + req.body.button)

}

       });


});

// Burada html sayfasına data gönderiyorum. Çalışması için bodyparser a ihtiyacı var.


app.get("/:title", function(req, res) {
  debugger;
  console.log(req.body.button);

 WorkList.find({}, function(err, data) {
      if (err) {
        err.status = 406;
        return next(err);
      } else {
        console.log("In First WorkList Search stat")
        workLists.length = 0;
        // console.log(data);
        data.forEach(function(item){
          workLists.push(item.listTitle);

        })


        }

      });


// PARAMS TITLE OLARAK FAVICON.ICO dönüyor
console.log(String(req.params.title));
console.log(req.body.button);
      if ((!workLists.includes(String(req.params.title)))  ) {
console.log("here in if");
// console.log(workLists);
// console.log(req.body.button);
        let title = String(req.params.title)

        if (title != "favicon.ico"){ // BURAYI SOR TITLE OLARAK IKI DATA GELIYOR BIRI FAVICON

        const newList = new WorkList({
          listTitle: title,
          listItems: []
        })
        newList.save();

        }

        res.render("list", {
          listTitle: String(req.params.title),
          newListTableItems: []
        });

      } else {
        console.log("here in else");
        let itemArray = []
        WorkList.findOne({"listTitle":String(req.params.title)}, function(err, data) {
             if (err) {
               err.status = 406;
               return next(err);
             } else {
               console.log("In Mapping stat")

if (data.listItems != null){
  data.listItems.forEach(function(item){
    // itemArray.push(item.content);
itemArray.push(item);

    })

}

                 if (req.params.title != "favicon.ico"){

                   console.log("Refresh");
                   res.render("list", {

                     listTitle: (req.params.title ),
                     newListTableItems: itemArray
                   });
             }

               }

             });
        // console.log("In else statement");
        //   let title = String(req.params.title)


      // var itesm =  WorkList.findOne({
      //     "listTitle": req.params.title
      //   }, function(err, data) {
      //     if (err) {
      //       err.status = 406;
      //       return next(err);
      //     } else {
      //       console.log("In Mapping stat");
      //       data.map(val => {
      //         data.listItems.push(val);
      //
      //         console.log(data.listItems);
      //       });
      //       console.log(workItems);
      //       return data
      //       }
      //
      //     });




}
});

app.post("/delete", function(req,res){
console.log(req.body.listName);
  Chore.findByIdAndDelete(String(req.body.checkbox), function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Deleted : ", docs);
      }
  });
  //   WorkList.findOne({"listTitle":String(req.params.title)}, function(err, data) {
  //      if (err) {
  //        err.status = 406;
  //        return next(err);
  //      } else {
  //     delete  data.listItems._id[String(req.body.checkbox)]
  // console.log("Data bu"+data);

  // OBJENIN ICINDEN SILEMEDIM

  WorkList.findOneAndUpdate({listTitle: String(req.body.listName)},
    {$pull: {listItems: {_id: String(req.body.checkbox)}}}, function(err,foundList){

      if (!err){
        res.redirect("/" + String(req.body.listName))
      }
    }
  )



       //   }
       //
       // });


// console.log(String(req.body.checkbox));

})


//
// var http = require('http');
//
//
// http.createServer(function (q, r) {
//
//   // control for favicon
//
//   if (q.url === '/favicon.ico') {
//     r.writeHead(200, {'Content-Type': 'image/x-icon'} );
//     r.end();
//     console.log('favicon requested');
//     return;
//   }
//
//   // not the favicon? say hai
//   console.log('hello');
//   r.writeHead(200, {'Content-Type': 'text/plain'} );
//   r.write('Hello, world!');
//   r.end();
//
// }).listen(3000);

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
