import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';
interface Props {
    id: string;
    name: string;
    username: string;
    imageUrl: string;
    userType?: string
}
function UserCard({
    id,
    name,
    username,
    imageUrl,
    userType
}: Props) {
    return (
        <article className='user-card'>
            <Link href={`/profile/${id}`}>
                <div className='user-card_avatar'>
                    <div className="relative h-14 w-14 ">
                        <Image
                            src={imageUrl}
                            alt={"profile image"}
                            fill
                            className="cursor-pointer rounded-full"
                        />
                    </div>

                    <div className='flex-1 !text-ellipsis'>
                        <h4 className='text-base-semibold text-light-1'>{name}</h4>
                        <span className='text-small-regular text-gray-1 '>@{username}</span>
                    </div>
                </div>
            </Link>
        </article>
    )
}

export default UserCard