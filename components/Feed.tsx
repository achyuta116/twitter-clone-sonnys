import { RefreshIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { Tweet } from '../typings'
import TweetBox from './TweetBox'
import TweetComponent from './Tweet'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'

interface Props {
	tweets: Tweet[]
}
function Feed({ tweets: tweetsProp }: Props) {
	const [tweets, setTweets] = useState(tweetsProp)

	const handleRefresh = async () => {
		const refreshToast = toast.loading('Refreshing...')
		const tweets = await fetchTweets()
		setTweets(tweets)
		toast.success('Feed Updated', {
			id: refreshToast
		})
	}
	return (
		<div className='col-span-7 lg:col-span-5 border-x max-h-screen overflow-scroll'>
			<div className='flex justify-between items-center'>
				<h1 className='p-5 pb-0 font-bold text-xl'>Home</h1>
				<RefreshIcon className='w-8 h-8 cursor-pointer text-twitter mr-5 mt-5
            transition duration-500 ease-out hover:rotate-180 active:scale-125
            ' onClick={handleRefresh}/>
			</div>

			{/* Tweet Box */}
			<div>
				<TweetBox setTweets={setTweets}/>
			</div>
			{/* Feed */}
			<div>
				{
					tweets.map(tweet => {
						return <TweetComponent key={tweet._id} tweet={tweet}/>
					})
				}
			</div>
		</div>
	)
}

export default Feed