"use client"
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { Span } from 'next/dist/trace';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


// Agent with props of type because we have 2 types 
// one to generate interv and other to create interv


enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING" ,
    ACTIVE = "ACTIVE" ,
    FINISHED = "FINISHED"
}


interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}


const Agent = ( {userName , userId , type} : {userName : string , userId : string , type : string}) => {

  



    const router = useRouter();

    const [isSpeaking, setisSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);


    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message : Message) => {

            if(message.type === "transcript" && message.transcriptType ==="final"){
                const newMessage = {
                    role: message.role,
                    content: message.transcript
                }

                setMessages((prev) => [...prev , newMessage]);
            }
        }


        const onSpeechStart = () => setisSpeaking(true);
        const onSpeechEnd = () => setisSpeaking(false);
        const onError = (error : Error) => {
            console.log("Error from agent :", error);
        }


        vapi.on("call-start" , onCallStart);
        vapi.on("call-end" , onCallEnd);
        vapi.on("message" , onMessage);
        vapi.on("speech-start" , onSpeechStart);
        vapi.on("speech-end" , onSpeechEnd);
        vapi.on("error" , onError); 


        return () => {
            
              vapi.off("call-start" , onCallStart);
        vapi.off("call-end" , onCallEnd);
        vapi.off("message" , onMessage);
        vapi.off("speech-start" , onSpeechStart);
        vapi.off("speech-end" , onSpeechEnd);
        vapi.off("error" , onError);
        }
        
    } ,[])


    useEffect(() => {

        if(callStatus === CallStatus.FINISHED)
            router.push("/");

    } , [messages,callStatus,type,userId])


    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
            variableValues:{
                username:userName,
                userId:userId,
                
            }
        })
    }


    const handleDisconnect = async () => {
         vapi.stop();
    }


   const latestMessage = messages[messages.length - 1]?.content;
   const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

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
                <p key={latestMessage} className={cn(
                    'transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>{latestMessage}</p>
            </div>
        </div>
    )}

<div className='w-full flex justify-center'>
{callStatus !== "ACTIVE" ? (
    <button className="relative btn-call" onClick={handleCall}>
        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !=='CONNECTING' && 'hidden')} />

        <span>{isCallInactiveOrFinished ? "Start Call" : "..."}</span>
        
    </button>
) : 
(
    <button className='btn-disconnect' onClick={handleDisconnect}>
        End Call
    </button>
)
}

</div>
    
    </>
  )
}

export default Agent