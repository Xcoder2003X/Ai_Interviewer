"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  
} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"


// dynamique formShema
const authFormSchema = ( type : "sign-in" | "sign-up") => {
return z.object({

    name : type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().min(2).max(50).email(),
    password: z.string().min(6).max(30),
  })
}


export function ProfileForm( {type} : {type?: "sign-in" | "sign-up"} ) {
    // 1. Define your form.

  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    
    try {

      if (type === "sign-in") {
        // Handle sign-in logic here

        const { email , password } = values;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if(!idToken) {
          toast.error(`Something went wrong.`);
          return;
        }


        // server call of sign in
        await signIn({
          email,idToken
        })
        toast.success(`Welcome back, ${values.email}! You have successfully signed in.`);
        router.push("/");
      } else {
        // Handle sign-up logic here

        const { name , email , password } = values;

        // to register a new user in firebase authentif and not firestore database
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp(
          {
            uid : userCredentials.user.uid,
            name : name!,
            email,
            password
          }
        )

        if(!result?.success) {
          toast.error(`Something went wrong. Your error is  : ${result?.message}`);
          return;
        }


        toast.success(`Account created successfully for ${values.email}! You can now sign in.`);
        router.push("/sign-in");
      }
      
    } catch ( e ) {
      console.log(e);
      toast.error(`Something went wrong. Your error is  : ${e}`);
      
    }
  }

  const isSignIn = type === "sign-in";
  const isSignUp = type === "sign-up";

  return (
    <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10 ">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={60}
                        width={60}
                    />
                    <h2 className="text-primary-100 form-title"><span>IntervPrep</span></h2>
                </div>

                <div className="title-2"><span>Practice job interview with AI</span></div>
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
       
       {isSignUp && 
       <FormField name="name" 
       control={form.control} 
       label="Name" 
       placeholder="Your Name" />}

       <FormField name="email" 
       control={form.control} 
       label="Email" 
       placeholder="Your Email"
       type="email" />

       <FormField name="password" 
       control={form.control} 
       label="Password" 
       placeholder="Your Password"
       type="password" />


       
        <button type="submit" className="submit"><span className="sign-text">{isSignIn ? "Sign-in ": "Create an account"}</span> </button>
      </form>
    </Form>

    <p className="text-center text-sm text-primary-100   " >
      {isSignIn ? "Don't have an account?" : "Already have an account?" }
      <Link href={`${isSignIn ? "/sign-up" : "/sign-in"}`} className=" font-bold text-user-primary ml-2">
      {isSignIn ? " Sign-up" : " Sign-in"  }
      </Link>
    </p>
    </div>
    </div>
  )
}