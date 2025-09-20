import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'


// This is the layout for authentication pages that don t have a header
const RootLayout = async ( { children } : { children: React.ReactNode } ) => {

  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
        <Image src="/logo.svg" alt='app_logo' width={100} height={42}/>
        <h2>IntervPrep</h2>
        </Link>
        </nav>{children}</div>
  )
  return (
    <div>layouAuthL</div>
  )
}

export default RootLayout 