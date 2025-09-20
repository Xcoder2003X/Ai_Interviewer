import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation';
import React from 'react'


// This is the layout for authentication pages that don t have a header
const AuthLayout =async ( { children } : { children: React.ReactNode } ) => {

  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect("/")

    
  return (
    <div className='auth-layout'>{children}</div>
  )
  return (
    <div>layouAuthL</div>
  )
}

export default AuthLayout