import React from 'react'
import { 
    BellIcon,
    HashtagIcon,
    CollectionIcon,
    DotsCircleHorizontalIcon,
    MailIcon,
    UserIcon,
    HomeIcon,
    BookmarkIcon
 } from "@heroicons/react/outline";
import SidebarRow from './SidebarRow';
import { signIn, signOut, useSession } from 'next-auth/react';


function Sidebar() {
  const { data: session } = useSession()
  return (
    <div className='flex flex-col items-center px-4 md:items-start col-span-2'>
        <img className='m-3 h-10 w-10' src="https://links.papareact.com/drq" alt="Twitter Logo"  />
        <SidebarRow Icon={HomeIcon} title="Home"/>
        <SidebarRow Icon={HashtagIcon} title="Explore"/>
        <SidebarRow Icon={BellIcon} title="Notifications"/>
        <SidebarRow Icon={MailIcon} title="Messages"/>
        <SidebarRow Icon={BookmarkIcon} title="Bookmarks"/>
        <SidebarRow Icon={CollectionIcon} onClick={!session ? signIn : signOut} title={session ? 'Sign Out' : 'Sign In'}/>
        <SidebarRow Icon={DotsCircleHorizontalIcon} title="More"/>
    </div>
  )
}

export default Sidebar