import mongoose from "mongoose";
import momgoose, {model, Schema} from "mongoose";

mongoose.connect("MONGOOSE_URI")

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true }
})

export const UserModel = model("User", UserSchema);

const contentTypes = ['image', 'video', 'article', 'audio', 'twitter', 'youtube', 'medium']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

export const contentModel = model("Content", contentSchema);

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

export const linkModel = model("Links", linkSchema);