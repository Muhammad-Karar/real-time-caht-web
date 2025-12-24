'use client';

import { MessageCircle, LogOut, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
  unreadCount?: number;
}

interface UserListProps {
  users: User[];
  currentUser: string;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  totalUnread: number;
}

export function UserList({
  users,
  currentUser,
  selectedUser,
  onSelectUser,
  onLogout,
  totalUnread,
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineUsers = filteredUsers.filter(u => u.isOnline);
  const offlineUsers = filteredUsers.filter(u => !u.isOnline);

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    // eslint-disable-next-line react-hooks/purity
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-2 shadow-lg shadow-blue-600/20">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">
                ChatFlow
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {currentUser}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {onlineUsers.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 mb-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Online ({onlineUsers.length})
                </span>
              </div>
              {onlineUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {user.username}
                      </p>
                      {user.unreadCount && user.unreadCount > 0 && (
                        <Badge className="bg-blue-600 hover:bg-blue-600 text-white h-5 min-w-5 px-1.5">
                          {user.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Online
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {offlineUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 py-1 mb-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Offline ({offlineUsers.length})
                </span>
              </div>
              {offlineUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {user.username}
                      </p>
                      {user.unreadCount && user.unreadCount > 0 && (
                        <Badge className="bg-blue-600 hover:bg-blue-600 text-white h-5 min-w-5 px-1.5">
                          {user.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatLastSeen(user.lastSeen)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No users found
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {totalUnread > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
              {totalUnread}
            </Badge>
            <span className="font-medium">
              {totalUnread === 1 ? 'unread message' : 'unread messages'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
