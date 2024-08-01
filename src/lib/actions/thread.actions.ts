"use server";

import Thread from "@/lib/models/thread.models";
import { connectToDB } from "@/lib/mongoose";
import UserMongo from "../models/user.models";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();

  try {
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // update user model
    await UserMongo.findByIdAndUpdate(author, {
      $push: {
        threads: createThread._id,
      },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`failed to create thread ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipPageAmount = (pageNumber - 1) * pageSize;

  try {
    const threadsQuery = Thread.find({
      parentId: {
        $in: [null, undefined],
      },
    })
      .sort({ createdAt: "desc" })
      .skip(skipPageAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: UserMongo,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: UserMongo,
          select: "_id name parentId image",
        },
      });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: {
        $in: [null, undefined],
      },
    });

    const threadsData = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipPageAmount + threadsData.length;

    return { threadsData, isNext };
  } catch (error: any) {
    throw new Error(`failed to fetch Threads ${error.message}`);
  }
}

export async function fetchThreadsById(id: string) {
  connectToDB();
  //  TO_DO populate community
  try {
    const thread = Thread.findByIdAndUpdate(id)
      .populate({
        path: "author",
        model: UserMongo,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: UserMongo,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate : {
              path: "author",
              model: UserMongo,
              select: "_id id name parentId image",
            }
          },
        ],
      }).exec();
    return thread;
  } catch (error: any) {
    throw new Error(`failed to fetch Threads ${error.message}`);
  }
}
