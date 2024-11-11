import { model, Schema } from "mongoose";

const issueSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
});

const issueModel = model("issues", issueSchema);

export default issueModel;
