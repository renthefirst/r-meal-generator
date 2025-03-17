'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import Logo from './logo';

const linkStyles = 'text-gray-700 hover:text-emerald-500 transition-colors';
const buttonStyles =
  'px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition';

export default function NavBar() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Logo  />
        </Link>

        <div className="flex items-center space-x-6">
          <SignedIn>
            <Link href="/mealplan" className={linkStyles}>
              Meal plan
            </Link>

            <Link href="/profile">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              )}
            </Link>

            <SignOutButton>
              <button className={buttonStyles}>Sign Out</button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Link href="/" className={linkStyles}>
              Home
            </Link>

            <Link
              href={isSignedIn ? '/subscribe' : '/sign-up'}
              className={linkStyles}
            >
              Subscribe
            </Link>

            <Link href="/sign-up" className={buttonStyles}>
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
