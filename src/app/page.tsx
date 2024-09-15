'use client'
// import Image from "next/image";
import Navbar from "./componente/Navbar";
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'




export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  
  
  return (
    
   
      <main>
      < Navbar/>
 
     
      
      </main>
    )
  
}
