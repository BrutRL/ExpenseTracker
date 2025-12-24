import mongoose from "mongoose";

const DbConnection = async () => {
  try {
    const MONGO_URL =
      "mongodb+srv://Dbpratice:practice123@expressdb.sv7yipa.mongodb.net/ExprenseTrackerr";

    await mongoose.connect(MONGO_URL);
    console.log(`Connected to Db`);
  } catch (error) {
    console.log(error);
  }
};

export default DbConnection;
