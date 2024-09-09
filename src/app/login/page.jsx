"use client";
import React, { useState } from 'react'
import Navbar from "../componente/Navbar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      router.push('/');
    } catch (error) {
      console.error(error);
    }

    
}
  return (
    <div>
      <Navbar />
      <div className='container mx-auto py-5'>
        <h3>Login page</h3>
        <hr className='my-3' />
        <form onSubmit={handleSubmit}>
          <input onChange={(e) => setEmail(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='email' placeholder='Enter your email'></input> 
          <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='password' placeholder='Enter your password'></input> 
          <button type='submit' className='bg-green-500 p-2 rounded-md text-white'>Sign in</button>
        </form>
        <hr className='my-3' />
 
      </div>
    </div>
  )
}

export default login