import mongoose from "mongoose";

let initialize = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);

  if (initialize) {
    console.log("mongodb already connected");
    return;
  }

  const url: string | undefined = process.env.MONGODB_URI;

  try {
    if (!url) {
      throw new Error("MONGODB_URI is not defined in the environment.");
    }
    await mongoose.connect(url, {
      //  dbName:"SAHAND-NEXT-ESTATE"
    });
    initialize = true;
    console.log("mongodb connected");
  } catch (error) {
    console.log("mongodb connection error:", error);
  }
};
