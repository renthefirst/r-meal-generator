'use client';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/spinner';

type ApiResponse = {
  message: string;
  error?: string;
};

async function CreateProfileRequest() {
  const response = await fetch('/api/create-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  return data as ApiResponse;
}

export default function CreateProfilePage() {

  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: CreateProfileRequest,
    onSuccess: () => {
      router.push('/subscribe');
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending) {
      mutate();
    }
  }, [isLoaded, isSignedIn, isPending, mutate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
      <span className="ml-2">Processing sign in...</span>
    </div>
  );
}
