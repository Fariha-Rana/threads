"use server";

import { connectToDB } from "../mongoose";
import UserMongo from "../models/user.models";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import { FilterQuery, SortOrder } from "mongoose";

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
        username: userName.toLowerCase(),
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

// to-do : populate community
export async function fetchUserPosts(userId: string) {
  connectToDB();
  try {
    return await UserMongo.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: UserMongo,
          select: "name image id ",
        },
      },
    });
  } catch (error: any) {
    throw new Error(`failed to fetch user threads:  ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;
    const regEx = new RegExp(searchString, "i");

    const query: FilterQuery<typeof UserMongo> = {
      id: {
        $ne: userId,
      },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        {
          username: {
            $regex: regEx,
          },
        },
        {
          name: {
            $regex: regEx,
          },
        },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const userQuery = UserMongo.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await UserMongo.countDocuments(query);

    const users = await userQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`failed to fetch user:  ${error.message}`);
  }
}

export async function fetchUserActivity(userId: string) {
  connectToDB();
  try {
    const userThreads = await Thread.find({ author: userId });
    const childThreads = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: {
        $in: childThreads,
      },
      author: {
        $ne: userId,
      },
    }).populate({
      path: "author",
      model: UserMongo,
      select: "name _id image ",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`failed to fetch user activity:  ${error.message}`);
  }
}
