import { cn } from '@/lib/utils';
import { Span } from 'next/dist/trace';
import Image from 'next/image'
import React from 'react'


// Agent with props of type because we have 2 types 
// one to generate interv and other to create interv


enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING" ,
    ACTIVE = "ACTIVE" ,
    FINISHED = "FINISHED"
}


const Agent = ( {userName , userId , type} : {userName : string , userId : string , type : string}) => {

    const isSpeaking = true;
    const callStatus = CallStatus.INACTIVE;

    const messages = [
        "what s your name ?",
        "what is your role ?",
        "what is your experience ?"
    ]

    const lastMessage = messages[messages.length - 1];
  return (
    <>
    <div className='call-view'>
        <div className='card-interviewer '>
            <div className='avatar'>
                <Image src="/ai-avatar.png" alt="avatar" className='object-cover'
                width={65} height={55} />

                {isSpeaking && <span className='animate-speak'></span>}
            </div>
            <h3> AI Interviewer </h3>
        </div>

        <div className='card-border'>
            <div className="card-content">
                <div className="rotating-border w-34 h-34 rounded-full inline-flex justify-center 
                items-center relative 
                animate-rotate">
                 <Image src="/user-avatar.jpeg" alt="user-avatar" className=' rounded-full object-cover size-[120px]'
                width={120} height={120} />
                </div>

                <h3> {userName} </h3>
            </div>
            
        </div>
    </div>

    {messages.length > 0 && 
    (
        <div className='transcript-border'>
            <div className='transcript'>
                <p key={lastMessage} className={cn(
                    'transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>{lastMessage}</p>
            </div>
        </div>
    )}

<div className='w-full flex justify-center'>
{callStatus !== "ACTIVE" ? (
    <button className="relative btn-call">
        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !=='CONNECTING' && 'hidden')} />

        <span>{ callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Start Call" : "..."}</span>
        
    </button>
) : 
(
    <button className='btn-disconnect'>
        End Call
    </button>
)
}

</div>
    
    </>
  )
}

export default Agent