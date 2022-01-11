import { useMemo } from "react";
 import {ApolloClient,InMemoryCache,NormalizedCacheObject,HttpLink} from '@apollo/client';
 import {setContext} from '@apollo/client/link/context';


 let apolloClient:ApolloClient<NormalizedCacheObject> | undefined;

 function createApolloCliente(){
     //create an  authentication link
     const authLink =  setContext((_,{headers})=>{
         //get the authentication tokejn from localstoraga if it exists
         //sessionStorage vs localstorage
         const token = sessionStorage.getItem('token');
         //return the headers to the contex so httpLink can read them
         return {
             headers:{
                 ...headers,
                 authorization: token ? `Bearer ${token}`: '',
             }
         }
     });

     const httpLink =  new HttpLink({
         uri:'http://localhost:3001/graphql',
         credentials:'include',
     });

     return new ApolloClient({
         link: authLink.concat(httpLink),
         cache: new InMemoryCache()
     })
 }

 //Iniialize apollo client with context and initial State
 export function initializeApollo(initialState:any= null) {
     const _apolloClient = apolloClient ?? createApolloCliente();

     //initial apollo client state get re-hydrated here
     if(initialState){
        _apolloClient.cache.restore(initialState);
     };

     //for SSR or SSG always create a new Apollo client
     if(typeof window === 'undefined') return _apolloClient;

     //create the apollo client once in the client
     if(!apolloClient) apolloClient = _apolloClient;
     return _apolloClient;
 }

 

 export function useApollo(initialState : any){
     const store  =  useMemo(() => initializeApollo(initialState), [initialState]);
     return store;
 }