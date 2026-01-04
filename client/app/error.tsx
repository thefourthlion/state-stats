"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error server-side only, never show to user
    console.error(error);
    
    // Automatically redirect to home after a brief delay
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [error, router]);

  // Show a minimal, user-friendly loading state
  // This will redirect automatically, so users won't see this for long
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Loading...</h1>
        <p style={{ color: '#666' }}>Please wait while we load the page.</p>
      </div>
    </div>
  );
}
