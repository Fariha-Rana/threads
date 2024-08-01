"use server";

import { connectToDB } from "../mongoose";
import UserMongo from "../models/user.models";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  userName: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  userName,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await UserMongo.findOneAndUpdate(
      { id: userId },
      {
        userName: userName.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`failed to create/update user : ${error.message}`);
  }
}

export async function fetchUserFromDatabase(userId: string) {
  try {
    connectToDB();
    return await UserMongo.findOne({ id: userId });
    // .populate({
    //   path : "communities",
    //   model : Community
    // });
  } catch (error: any) {
    throw new Error(`failed to fetch user:  ${error.message}`);
  }
}
