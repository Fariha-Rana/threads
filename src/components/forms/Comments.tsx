"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"

import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
// import { updateUser } from "@/lib/actions/user.actions";

import { addCommentToThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";

interface Props {
    threadId: string,
    currentUserImg: string,
    currentUserId: string,
}

function Comments({ threadId, currentUserImg, currentUserId }: Props) {
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname,
        )

        form.reset();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex  gap-3 w-full">
                            <FormLabel>
                            <div className="relative h-14 w-14 " >
                            <Image src={currentUserImg} fill alt="profile Image" className="rounded-full " />
                        </div>
                                
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input type="text"
                                    className=" outline-none text-light-1  no-focus"
                                    placeholder="Comment..."
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">Post Comment</Button>
            </form>
        </Form>
    )
}

export default Comments