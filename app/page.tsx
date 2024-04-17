import { redirect } from 'next/navigation';
import { checkUserLogin } from './auth';
// import useSWR from 'swr';

async function check() {
  'use server';
  const user = await checkUserLogin();

  console.log(user);

  if (!user.isLogin) {
    redirect('/create-account');
  }

  return { email: user.email, name: user.name };
}

export default async function Home() {
  const user = await check();

  return (
    <div className='flex flex-col'>
      <span className='text-5xl font-bold'>Welcome {user.name}!!</span>
      <span className='text-2xl font-bold'>Your email is : {user.email}</span>
    </div>
  );
}
