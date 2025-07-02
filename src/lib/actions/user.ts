import User from "../models/user";
import { connect } from "../mongodb/mongoose";

// interface ClerkEmail{
//     email:string,
//     id:string,
//     linked_to:any[],
//     object:"email_address",
//     verification:any
// };

export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  email_addresses: any[]
) => {
  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email,
        },
      },
      { upsert: true, new: true }
    );

    return user;
  } catch (error) {
    console.log("Error:", error);
  }
};
//📒📒Explanation

// 📒📒 Goal of the Code
// The createOrUpdateUser function tries to find a user in the database (MongoDB) by their clerkId, and:

// ✅ If the user exists, it updates their info.

// ❌ If the user doesn't exist, it creates a new user.📒📒

//1. { clerkId: id }
// This tells MongoDB:
// 👉 “Find a user whose clerkId is equal to the passed id.”📒📒
//2.{
//   $set: {
//     firstName: first_name,
//     lastName: last_name,
//     profilePicture: image_url,
//     email: email_addresses[0].email,
//   }
// }This is what MongoDB should do if it finds a matching document:

// $set updates only the specified fields.

// If firstName, lastName, etc. already exist, they will be replaced.

// email_addresses[0].email accesses the first email object in the array (you assume it exists).
//3.{ upsert: true, new: true }
//upsert: true If no document matches the filter (clerkId: id), create a new one
//new: true  After the update, return the updated document, not the original one📒📒

export const deleteUser = async (id: string) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log("Error:", error);
  }
};
