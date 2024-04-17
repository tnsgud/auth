'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { checkUserExists, createUser } from '../auth';
import { useRouter } from 'next/navigation';

const emailRegexp = /^\S+@\S+\.\S+$/;

export default function CreateAccount() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email } = data;
    const userExists = await checkUserExists(email);

    if (userExists) {
      alert('you already have an account');
      return router.replace('/log-in');
    }

    const user = await createUser(data);

    alert(`account created! ${JSON.stringify(user)}`);
    return router.replace('/log-in');
  };

  return (
    <div>
      <h1 className='text-3xl'>Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            className='text-black'
            type='text'
            id='name'
            required
            {...register('name')}
          />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            className='text-black'
            type='email'
            id='email'
            required
            {...register('email', {
              pattern: {
                value: emailRegexp,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span className='ml-2'>{errors.email.message}</span>}
        </div>
        <button type='submit'>Create Account</button>
      </form>
    </div>
  );
}
