import { useState,useContext,createContext,useEffect  } from "react";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import { useSignInMutation } from "lib/graphql/signin.graphql";
import {usePostRegisterMutation} from 'lib/graphql/singup.graphql';
import { useGetCurrentUserQuery } from "lib/graphql/currentUser.graphql";


type AuthProps = {
    user:any;
    error:string;
    signIn:(email:any,password:any) => Promise<void>;
    signUp:(email:any,password:any) => Promise<void>;
    signOut : ()=> void;
}

const AuthContext = createContext<Partial<AuthProps>>({});


//You can wrap you _app.tsx with the provider
export function AuthProvider({children}){
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}

function useProvideAuth(){
    const client =  useApolloClient();
    const router =  useRouter();

    const [error,setError] = useState('');
    const {data} = useGetCurrentUserQuery({
        fetchPolicy:'network-only',
        errorPolicy:'ignore',
    });
    const user =  data && data.getCurrentUser;
    //Siging In and Signing Up
    const [signInMutation] = useSignInMutation();
    const [signUpMutation] = usePostRegisterMutation();

    const signIn = async (email,password) =>{
        try {
            const {data} = await signInMutation({
                variables:{
                  input:{
                      email,
                      password
                  }
                }
            });

            if(data.postLogin.token && data.postLogin.user){
                sessionStorage.setItem('token',data.postLogin.token);
                client.resetStore()
                    .then(()=>{
                        router.push('/');
                    });
            }else{
                setError('Invalid login');
            }
        } catch (error:any) {
            setError(error.message);
        }
    }


    const signUp = async (email,password) =>{
        try {
            const {data} = await signUpMutation({
                variables:{
                  input:{
                      email,
                      password
                  }
                }
            });

            if(data.postRegister.token && data.postRegister.user){
                sessionStorage.setItem('token',data.postRegister.token);
                client.resetStore()
                    .then(()=>{
                        router.push('/');
                    });
            }else{
                setError('Invalid login');
            }
        } catch (error:any) {
            setError(error.message);
        }
    }

    const signOut = ()=>{
        sessionStorage.removeItem('token');
        client.resetStore().then(()=>{
            router.push('/')
        });
    }

    return {
        user,
        error,
        signIn,
        signOut,
        signUp
    }
}