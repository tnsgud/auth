'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { login } from '../auth';
import { useRouter } from 'next/navigation';

const emailRegexp = /^\S+@\S+\.\S+$/;

export default function LogIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { status, msg } = await login(data.email);

    alert(msg);

    if (status === 'error') {
      return reset();
    }

    return router.replace('/');
  };

  return (
    <div>
      <h1 className='text-3xl'>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}
