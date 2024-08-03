import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    author: {
        name: string,
        image: string,
        id: string
    },
    community: {
        id: string,
        name: string,
        image: string
    } | null
    createdAt: string,
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean
}

function ThreadCard({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}: Props) {

    return (
        <article className={`flex w-full flex-col rounded-xl mt-4 ${isComment ? "px-0 sm:px-7" : "bg-dark-2 p-7"}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 gap-4">
                    <div className="flex flex-col items-center">
                        <Link className="relative h-14 w-14 " href={`/profile/${author.id}`}>
                            <Image
                                src={author.image}
                                alt={"profile image"}
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link className="w-fit" href={`/profile/${author.id}`}>
                            <h2 className="cursor-pointer text-base-semibold text-light-1"> {author.name}</h2>
                        </Link>

                        <p className="text-small-regular mt-1 text-light-2">{content}</p>

                        <div className="flex  mt-5 gap-3 flex-col">
                            <div className="flex gap-3.5">
                                <Image
                                    src="/assets/heart-gray.svg"
                                    alt={"heart"}
                                    width={24}
                                    height={24}
                                    className="cursor-pointer  object-contain"
                                    title="like"
                                />
                                <Link href={`/thread/${id}`} title="reply">
                                    <Image
                                        src="/assets/reply.svg"
                                        alt={"reply"}
                                        width={24}
                                        height={24}
                                        className="cursor-pointer  object-contain"

                                    />
                                </Link>
                                <Image
                                    src="/assets/repost.svg"
                                    alt={"repost"}
                                    width={24}
                                    height={24}
                                    className="cursor-pointer  object-contain"
                                    title="repost"
                                />
                                <Image
                                    src="/assets/share.svg"
                                    alt={"share"}
                                    width={24}
                                    height={24}
                                    className="cursor-pointer  object-contain"
                                    title="share"
                                />
                            </div>
                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`} title="replies">
                                        <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                        <p className="mt-5 text-subtle-medium text-gray-1">{formatDateString(createdAt)}ppppppp</p>
                                    </Link>
                                )
                            }

                            {/* TODO : Deleted Thread */}
                            {/* TODO : Show comment logos */}
                            {
                                !isComment && community && (
                                    <Link href={`/communities/${community.id}`} title="replies" className="mt-2 flex items-center">
                                        <p className="mt-5 text-subtle-medium text-light-1">{formatDateString(createdAt)} {community.name} Community</p>
                                        <p className="mt-5 text-subtle-medium text-light-1">{comments.length} replies</p>

                                        <Image
                                            src={community.image}
                                            alt={community.name}
                                            width={14}
                                            height={14}
                                            className="cursor-pointer rounded-full"
                                        />
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ThreadCard