'use client';

import { useEffect, useRef } from 'react';
import { MessageCircle, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageInput } from './MessageInput';
import { format } from 'date-fns';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  currentUser: string;
  onSendMessage: (content: string) => void;
}

export function ChatArea({
  selectedUser,
  messages,
  currentUser,
  onSendMessage,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return format(messageDate, 'MMM d, yyyy');
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = formatDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Welcome to ChatFlow
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Select a user from the list to start chatting. Your messages will be delivered instantly!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {selectedUser.username.charAt(0).toUpperCase()}
            </div>
            {selectedUser.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
              {selectedUser.username}
            </h3>
            <div className="flex items-center gap-1.5">
              <Circle
                className={`w-2 h-2 ${
                  selectedUser.isOnline
                    ? 'fill-green-500 text-green-500'
                    : 'fill-slate-400 text-slate-400'
                }`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedUser.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-full">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {date}
                  </p>
                </div>
              </div>

              {dateMessages.map((message, index) => {
                const isOwn = message.senderId === 'me';
                const showAvatar =
                  index === 0 ||
                  dateMessages[index - 1].senderId !== message.senderId;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwn && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm shadow">
                            {message.senderName.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-md lg:max-w-lg ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      {showAvatar && !isOwn && (
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 ml-1">
                          {message.senderName}
                        </p>
                      )}
                      <div
                        className={`group relative px-4 py-2.5 rounded-2xl shadow-sm ${
                          isOwn
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-[11px] mt-1 ${
                            isOwn
                              ? 'text-blue-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>

                    {isOwn && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold text-sm shadow">
                            {currentUser.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-8" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
