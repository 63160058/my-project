"use client";
import React, { useState } from 'react'
import Navbar from "../componente/Navbar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Registerpage() {

  const [User_fname, setUserfname] = useState('');
  const [User_lname, setUserlname] = useState('');
  const [User_email, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ User_fname, User_lname, User_email, password})
      });
      router.push('/login');
    } catch (error) {
      console.error(error);
    }

    if (password !== confirmpassword) {
      alert('Password does not match');
      return;
    }

    
}

  return (
    <div>
      <Navbar />
      <div className='container mx-auto py-5'>
        <h3>Register page</h3>
        <hr className='my-3' />
        <form onSubmit={handleSubmit}>
          <input onChange={(e) => setUseremail(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='email' placeholder='Enter your email'></input> 
          <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='password' placeholder='Enter your password'></input>
          <input onChange={(e) => setConfirmpassword(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='password' placeholder='Confirm your password'></input> 
          <input onChange={(e) => setUserfname(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='text' placeholder='Enter your First Name'></input> 
          <input onChange={(e) => setUserlname(e.target.value)} className='block bg-gray-100 p-2 my-2 rounded-md' type='text' placeholder='Enter your Last Name'></input> 
         
          <button type='submit' className='bg-green-500 p-2 rounded-md text-white'>Sign Up</button>

        </form>
        <hr className='my-3' />
        <p>Do not have an account? go to <Link className='text-blue-500 hover:underline' href="/login">Sign in</Link> Page</p>
      </div>
    </div>
  )
}

export default Registerpage