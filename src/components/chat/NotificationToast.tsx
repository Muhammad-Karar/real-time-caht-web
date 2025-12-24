'use client';

import { useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationToastProps {
  sender: string;
  message: string;
  onClose: () => void;
  onClick: () => void;
}

export function NotificationToast({
  sender,
  message,
  onClose,
  onClick,
}: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[320px] max-w-md">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-2 shadow-lg shadow-blue-600/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {sender}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-[shrink_5s_linear]" />
        </div>
      </div>
    </div>
  );
}
