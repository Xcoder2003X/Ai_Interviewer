import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <>
        <h3>Generate Mock Interview :</h3>

        <Agent userName="you" userId="userId" type="generate" />

    </>

  )
}

export default page