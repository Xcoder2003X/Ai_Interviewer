
"use server"

import { db , auth } from "@/firebase/admin";
import { cookies } from "next/headers";

interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
}


interface SignInParams {
    idToken: string;
    email: string;
}


interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}


const OneWeek = 1000 * 60 * 60 * 24 * 7;
export async function signUp(params : SignUpParams){

    const { uid , name , email } = params;

    try {

        const userRecord = await db.collection('users').doc(uid).get()
        
        if(userRecord.exists){

            return {
                success: false,
                message: 'User already exists'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: 'User created successfully . Please sign in .'
        }


    } catch (error:any) {
        
        console.log("Error creating user:", error);

        if(error.code === 'auth/email-already-in-use'){

            return {
                success: false,
                message: 'This Email is already Used'
            }
        }
    }
}


export async function signIn(params : SignInParams){

    const { email , idToken } = params;
    try {

        const userRecord = await auth.getUserByEmail(email);


        if(!userRecord){

            return {
                success: false,
                message: 'User not found . Create an account instead .'
            }
        }

        await setSessionCookies(idToken);
        
    } catch (error) {
        console.log("Error signing in user:", error);
    }

}
export async function setSessionCookies(idToken : string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken , {
        expiresIn: OneWeek
    })


    cookieStore.set("session" , sessionCookie , {
        maxAge : OneWeek,
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })

}


export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const seesionCookie = cookieStore.get('session')?.value;

    if(!seesionCookie){
        return null ;
    }

    try {

        const decodedClaims = await auth.verifySessionCookie(seesionCookie , true);

        const userRecord = await db.collection("users")
        .doc(decodedClaims.uid).get();

        if(!userRecord.exists){
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id ,
        } as User ;
        
    } catch (error) {
        console.log("Error getting current user:", error);
        return null;
    }
}


export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user; // true if user exit false if not
}
