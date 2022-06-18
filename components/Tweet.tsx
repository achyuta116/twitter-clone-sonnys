import React, { useEffect, useState } from 'react'
import { Comment, Tweet, CommentBody } from '../typings'
import TimeAgo from "react-timeago";
import {
    ChatAlt2Icon,
    HeartIcon,
    SwitchHorizontalIcon,
    UploadIcon
} from "@heroicons/react/outline";
import { fetchComments } from '../utils/fetchComments';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
    tweet: Tweet
}


function Tweet({ tweet }: Props) {
    const [comments, setComments] = useState<Comment[]>([])
    const [input, setInput] = useState<string>('')
    const [commentBoxIsVisible, setCommentBoxIsVisible] = useState<boolean>(false)
    const refreshComments = async () => {
        const comments: Comment[] = await fetchComments(tweet._id)
        setComments(comments)
        console.log(comments)
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const commentToast = toast.loading('Posting Comment...')

        // Comment logic
        const comment: CommentBody = {
            comment: input,
            tweetId: tweet._id,
            username: session?.user?.name || 'Unknown User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
        }

        const result = await fetch(`/api/addComment`, {
        body: JSON.stringify(comment),
        method: 'POST',
        })

        toast.success('Comment Posted!', {
        id: commentToast,
        })

        setInput('')
        setCommentBoxIsVisible(false)
        refreshComments()
    }

    useEffect(() => {
        refreshComments()
    }, [])

    const { data: session } = useSession()

    return (
        <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
            <div className='flex space-x-3'>
                <img className='h-10 w-10 object-cover rounded-full' src={tweet.profileImg} alt="" />
                <div>
                    <div className='flex items-center space-x-1'>
                        <p className='mr-1 font-bold'>{tweet.username}</p>
                        <p className='hidden text-gray-500 sm:inline text-sm'>@{tweet.username.replace(/\s+/g, '').toLowerCase()}</p>
                        <TimeAgo
                            className='text-sm text-gray-500'
                            date={tweet._createdAt} />
                    </div>
                    <p className='pt-1'>{tweet.text}</p>
                    {tweet.image &&
                        <img className='m-5 ml-0 mb-1 max-h-60 rounded-lg shadow-xl' src={tweet.image} alt="" />
                    }
                </div>
            </div>
            <div className='flex justify-between mt-5'>
                <div onClick={() => session && setCommentBoxIsVisible(!commentBoxIsVisible)} className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <ChatAlt2Icon className='w-5 h-5' />
                    <p>{comments.length}</p>
                </div>
                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <SwitchHorizontalIcon className='w-5 h-5' />
                </div>
                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <HeartIcon className='w-5 h-5' />
                </div>
                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <UploadIcon className='w-5 h-5' />
                </div>
            </div>
            {/* Comment Box Logic */}
            {commentBoxIsVisible && 
                <form className='mt-5 flex space-x-3'>
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" className='flex-1 rounded-lg bg-gray-100 p-2 outline-none' placeholder='Write a comment...'/>
                    <button disabled={!input} type='submit' onClick={handleSubmit} className='text-twitter disabled:text-gray-200'>Post</button>
                </form>
            }
            {
                comments?.length > 0 && (
                    <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5'>
                        {comments.map(comment => (
                            <div key={comment._id} className='relative flex space-x-2'>
                                <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30 '/>
                                <img className='h-7 w-7 object-cover rounded-full mt-2' src={comment.profileImg} alt="" />
                                <div>
                                    <div className='flex items-center space-x-1'>
                                        <p className='mr-1 font-bold'>{comment.username}</p>
                                        <p className='hidden text-sm text-gray-500 lg:inline'>@{comment.username.replace(/\s+/g,'').toLowerCase()}</p>
                                        <TimeAgo date={comment._createdAt} className='text-sm text-gray-500'/>
                                    </div>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default Tweet