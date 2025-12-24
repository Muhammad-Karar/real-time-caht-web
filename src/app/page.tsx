'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Users, Zap, Bell } from 'lucide-react';

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from '@/_redux/hook';
import { loginUser } from '@/_redux/features/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // You can also access loading state from Redux if you want
  const reduxStatus = useAppSelector((state) => state.auth.status);

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  // Local loading state is fine, or use reduxStatus === 'loading'
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- Validation ---
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    // --- Redux Integration ---
    setIsLoading(true);

    try {
      // Dispatch the login action
      // .unwrap() allows us to catch errors if the API fails
      await dispatch(loginUser(username)).unwrap();
      
      // Navigate only after successful login/socket connection
      router.push('/chat');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to join chat. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-2xl p-3 shadow-lg shadow-blue-600/20">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ChatFlow
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Connect instantly with real-time messaging
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Instant Messaging
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Messages delivered in real-time via WebSockets
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Online Presence
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                See who&apos;s online and available to chat
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Smart Notifications
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Never miss a message with instant alerts
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Message History
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access all your previous conversations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Join ChatFlow
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Enter your username to start chatting
              </p>
            </div>

            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 text-lg"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining...
                  </div>
                ) : (
                  'Start Chatting'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                No registration required. Just pick a username and go!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}