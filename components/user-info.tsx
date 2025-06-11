"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function UserInfo() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString()
          .replace('T', ' ')
          .split('.')[0]
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-500">Please sign in to view your information.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="h-12 w-12 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium">
              {user.username || user.fullName || 'Anonymous User'}
            </h3>
            <p className="text-sm text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">
            Current Date and Time (UTC):
            <br />
            <span className="font-mono">{currentTime}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Current User's Login:
            <br />
            <span className="font-mono">{user.username || 'Not set'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}