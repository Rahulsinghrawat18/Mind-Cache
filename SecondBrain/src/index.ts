import express, { Request, Response } from "express";
import { contentModel, linkModel, UserModel } from "./db";
import bcrypt, { hash } from 'bcrypt';
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/v1/signup", async (req, res) => {
  try {
      const username = req.body.username;
      const password = req.body.password;

      // Username validation
      if (!/^[a-zA-Z]{3,10}$/.test(username)) {
          res.status(411).json({ error: "Username should be 3-10 letters." });
          return;     
        }

      // Password validation
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
          res.status(411).json({
              error: "Password should be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
            return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
           res.status(403).json({ error: "User already exists with this username." });
           return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save new user
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();

      res.status(200).json({ message: "Signed up successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/v1/signin", async (req, res) => {
  try {
      const { username, password } = req.body;

      const user = await UserModel.findOne({ username });
      if (!user) {
         res.status(403).json({ error: "Invalid Credentials" });
        return;
        }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         res.status(403).json({ error: "Invalid Credentials" });
        return;
        }

        const token = jwt.sign(
          { id: user._id }, 
          SECRET_KEY, 
          { expiresIn: "1h" }
        );
        res.status(200).json({ token });
        return;

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
});


// app.post("/api/v1/content",userMiddleware, async (req, res) => {
//   try {
//       const { type, link, title, tags } = req.body;

//       if (!["document", "tweet", "youtube", "link"].includes(type)) {
//        res.status(400).json({ error: "Invalid content type." });
//        return;      
//       }

//       if (!link || !title || !Array.isArray(tags) || tags.length === 0) {
//         res.status(400).json({ error: "Invalid input data." });
//         return;
//       }

//       const newContent = new contentModel({ type, link,
//         //@ts-ignore
//         userID: req.userID,
//         title, tags });
//       await newContent.save();

//       res.status(201).json({ message: "Content added successfully." });
//       return;
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error." });
//       return;
//     }
// });
const contentTypes = ['image', 'video', 'article', 'audio', 'twitter', 'youtube', 'medium'];
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;  // Destructure title from req.body

  console.log("request Body : ", req.body);
  console.log("User Id: ", req.userId);

  if (!contentTypes.includes(type)) {
    res.status(400).json({
      message: "!ContentTypes" // Now the frontend can detect this
    });
    return;
  }
   
    
  try {
    await contentModel.create({
      link,
      type,
      title: req.body.title,  // Add title here
      userId: req.userId,
      tags: [] 
    });

    res.json({
      message: "Content Added"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add content"
    });
  }
});


app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const content = await contentModel.find({ userId }).populate("userId", "username");
    res.json({ content });
  } catch (error) {
    res.status(500).json
    ({ 
      message: "Failed to retrieve content"
    });
  }
});



app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;

  try {
    // Find the content and populate the userId to get user details
    const content = await contentModel.findById(contentId).populate("userId", "username _id");

    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;    
    }

    // Check if the logged-in user is the owner of the content
    if (content.userId && content.userId.toString() !== req.userId) {
      res.status(403).json({ message: "You are not authorized to delete this content" });
      return;
    }

    // Delete the content
    await contentModel.findByIdAndDelete(contentId);

    res.status(200).json({
      message: "Delete succeeded"
      });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


app.post("/api/v1/brain2/share",userMiddleware, async (req, res) => {
  const share = req.body.share;
  if(share){
    const existingUser = await linkModel.findOne({
      userId: req.userId
    });
    if(existingUser){
      res.json({
        hash: existingUser.hash
      })
      return;
    }
    const hash = random(10);
    await linkModel.create({
      userId: req.userId,
      hash: hash
    })

    res.json({
      message: hash
    })
  }
  else{
    await linkModel.deleteOne({
      userId: req.userId
    });

    res.json({
      message: "Removed Link"
    })
  }
})

app.get("/api/v1/brain2/:shareLink", async (req, res) => {
  //console.log("inside");
  
  const hash = req.params.shareLink;
  //console.log(hash);
  
  const link = await linkModel.findOne({
    hash
  });
  if(!link){
    res.status(411).json({
      message: "Sorry Incorrect Input"
    })
    return;
  }
  //userId
  const content = await contentModel.find({
    userId: link.userId
  })

  const user = await UserModel.findOne({
    _id: link.userId
  })

  // console.log(link);
  
  if(!user){
    res.status(411).json({
      message: "user not found, error should ideally not happen"
    })
    return;
  }

  res.json({
    username: user.username,
    content: content
  })
})

app.listen(3000);


