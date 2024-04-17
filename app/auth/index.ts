'use server';
import { cookies } from 'next/headers';
import { SessionOptions, getIronSession } from 'iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sessionOptions: SessionOptions = {
  password: '4BwTimBf9vtxLZ03s5LuKfBJ9G37yuvZ',
  cookieName: 'nomad-next-session',
};

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
}

export async function checkUserLogin() {
  const session = await getSession();

  return { ...session, isLogin: !!session.email };
}

export async function findUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function checkUserExists(email: string) {
  const user = await findUser(email);

  return user !== null;
}

export async function createUser(data: createUserParams) {
  const user = await prisma.user.create({
    data,
  });

  return user;
}

export async function login(email: string) {
  const user = await findUser(email);

  if (!user) {
    return { status: 'error', msg: 'User not found' };
  }

  const session = await getSession();

  session.email = user.email;
  session.name = user.name;

  await session.save();

  return { status: 'success', msg: 'Logged in' };
}
