"use server";

import Thread from "@/lib/models/thread.models";
import UserMongo from "../models/user.models";
import Community from "../models/community.models";

import { connectToDB } from "@/lib/mongoose";
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
  
  try {
    connectToDB();
  
    const communityObj = await Community.findOne(
      {id : communityId},
      {_id : 1}
    )

    const createThread = await Thread.create({
      text,
      author,
      community: communityObj,
      parentId : ""
    });

    // update user model
    await UserMongo.findByIdAndUpdate(author, {
      $push: {
        threads: createThread._id,
      },
    });

    if(communityObj){
      await Community.findByIdAndUpdate(communityObj, {
        $push : {
          threads : createThread._id
        }
      })
    }
    console.log(communityObj)
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
      $or: [
        { parentId: { $exists: false } },
        { parentId: "" }
      ]
    })
      .sort({ createdAt: "desc" })
      .skip(skipPageAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: UserMongo,
      })
      .populate({
        path: "community",
        model: Community,
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
      $or: [
        { parentId: { $exists: false } },
        { parentId: "" }
      ]
    });

    const threadsData = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipPageAmount + threadsData.length;

    return { threadsData, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch Threads: ${error.message}`);
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
        path: "community",
        model: Community,
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

export async function addCommentToThread(
  threadId: string,
  text : string,
  userId : string,
  path : string,
) {
  connectToDB();

  console.log(threadId)
  try {
    const parentThread  = await Thread.findById(threadId);

    if(!parentThread) throw new Error("Thread Not found") ;

    const commentThread = new Thread({
      text : text,
      author : userId,
      parentId : threadId,
    })

    console.log(commentThread);

    const savedThread = await commentThread.save();

    console.log(savedThread);
    
    parentThread.children.push(savedThread._id);
    
    await parentThread.save();
    console.log("Comment added successfully")
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread : ${error.message}`);
  }
}



// async function fetchAllChildThreads(threadId: string): Promise<any[]> {
//   const childThreads = await Thread.find({ parentId: threadId });

//   const descendantThreads = [];
//   for (const childThread of childThreads) {
//     const descendants = await fetchAllChildThreads(childThread._id);
//     descendantThreads.push(childThread, ...descendants);
//   }

//   return descendantThreads;
// }

// export async function deleteThread(id: string, path: string): Promise<void> {
//   try {
//     connectToDB();

//     // Find the thread to be deleted (the main thread)
//     const mainThread = await Thread.findById(id).populate("author community");

//     if (!mainThread) {
//       throw new Error("Thread not found");
//     }

//     // Fetch all child threads and their descendants recursively
//     const descendantThreads = await fetchAllChildThreads(id);

//     // Get all descendant thread IDs including the main thread ID and child thread IDs
//     const descendantThreadIds = [
//       id,
//       ...descendantThreads.map((thread) => thread._id),
//     ];

//     // Extract the authorIds and communityIds to update User and Community models respectively
//     const uniqueAuthorIds = new Set(
//       [
//         ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
//         mainThread.author?._id?.toString(),
//       ].filter((id) => id !== undefined)
//     );

//     const uniqueCommunityIds = new Set(
//       [
//         ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
//         mainThread.community?._id?.toString(),
//       ].filter((id) => id !== undefined)
//     );

//     // Recursively delete child threads and their descendants
//     await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

//     // Update User model
//     await User.updateMany(
//       { _id: { $in: Array.from(uniqueAuthorIds) } },
//       { $pull: { threads: { $in: descendantThreadIds } } }
//     );

//     // Update Community model
//     await Community.updateMany(
//       { _id: { $in: Array.from(uniqueCommunityIds) } },
//       { $pull: { threads: { $in: descendantThreadIds } } }
//     );

//     revalidatePath(path);
//   } catch (error: any) {
//     throw new Error(`Failed to delete thread: ${error.message}`);
//   }
// }
