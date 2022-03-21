const express = require("express");
    const mongoose = require("mongoose");
    
    const app = express();
    
    app.use(express.json());
    
    const connect = () => {
      return mongoose.connect(
        "mongodb://127.0.0.1:27017/unit4"
      );
    };
    
   
    const userSchema = new mongoose.Schema(
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: false },
        age:{type:Number, required:true},
        email: { type: String, required: true, unique: true },
       
      },
      {
        versionKey: false,
        timestamps: true, 
      }
    );
    
   
    const User = mongoose.model("user", userSchema); 
    
    
    const bookSchema = new mongoose.Schema(
      {
        coverimage: { type: String, required: true },
        body: { type: String, required: true },
        content:{ type: String, required: true},
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
      {
        versionKey: false,
        timestamps: true,
      }
    );
    
   
    const book = mongoose.model("book", bookSchema);


    const publicationSchema = new mongoose.Schema(
        {
         
          name:{ type: String, required: true},
          bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "book",
            required: true,
          },
        
        },
        {
          versionKey: false,
          timestamps: true,
        }
      );
      
     
      const Publication = mongoose.model("publication", publicationSchema);
      
    
    const commentSchema = new mongoose.Schema(
      {
        body: { type: String, required: true },
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "book",
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
      {
        versionKey: false,
        timestamps: true,
      }
    );
    
    
    const Comment = mongoose.model("comment", commentSchema);
    
    
    
    // USERS CRUD
    app.get("/users", async (req, res) => {
      try {
        const users = await User.find().lean().exec();
    
        return res.status(200).send({ users: users }); 
      } catch (err) {
        return res
          .status(500)
          .send({ message: "Something went wrong .. try again later" });
      }
    });
    
    app.post("/users", async (req, res) => {
      try {
        const user = await User.create(req.body);
    
        return res.status(201).send(user);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    });
    
   
  
    
    // books CRUD
    app.get("/books", async (req, res) => {
      try {
        const books = await book.find()
        .populate({
          path:"userId",
          select:{firstName:1,email:1,_id:0}
        })
        .lean().exec();
    
        return res.status(200).send(books);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    });
    
    app.post("/books", async (req, res) => {
      try {
        const book = await book.create(req.body);
    
        return res.status(200).send(book);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    });
    
   
    
    //COMMENT CRUD
    
    app.get("/comments", async (req, res)=>{
      try {
        const comments = await Comment.find()
        .populate({
          path:"bookId",
          select:["name"],
          populate:{path:"userId",select:["firstName"]}
        })
        .populate({path:"userId",select:["firstName"]})
        .lean().exec();
    
        return res.status(200).send(comments);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    
    })
    
    
    app.post("/comments", async (req, res)=>{
      try {
        const comment = await Comment.create(req.body);
    
        return res.status(201).send(comment);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    
    })
    
    
    
    
    app.listen(5003, async () => {
      try {
        await connect();
      } catch (err) {
        console.log(err);
      }
    
      console.log("listening on port 5003");
    })

