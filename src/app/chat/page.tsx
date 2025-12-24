'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// --- Redux & Services ---
import { useAppDispatch, useAppSelector } from '@/_redux/hook';
import { logout } from '@/_redux/features/authSlice';
import { 
  loadUsers, 
  loadHistory, 
  selectUser, 
  addMessage 
} from '@/_redux/features/chatSlice';
import { emitMessage } from '@/_redux/services/socketService';
// Make sure you import it from the correct file!
import { loginUser as loginAuth } from '@/_redux/features/authSlice';

// --- UI Components ---
import { UserList } from '@/components/chat/UserList'; // Ensure these paths match where you saved the files
import { ChatArea } from '@/components/chat/ChatArea';
import { NotificationToast } from '@/components/chat/NotificationToast';

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // --- Redux State ---
  const { username: currentUser } = useAppSelector((state) => state.auth);
  const { 
    onlineUsers, 
    messages, 
    selectedUser: selectedUsername 
  } = useAppSelector((state) => state.chat);

  // --- Local State ---
  const [notification, setNotification] = useState<{ sender: string; content: string } | null>(null);

  // --- UPDATED AUTH GUARD ---
  useEffect(() => {
    // 1. Check if we are already logged in via Redux
    if (!currentUser) {
      // 2. If not, check LocalStorage
      const savedUser = localStorage.getItem('chat_username');

      if (savedUser) {
        // 3. Found a saved user! Log them back in automatically.
        // This reconnects the socket and fetches data.
        dispatch(loginAuth(savedUser)); 
      } else {
        // 4. No saved user? Redirect to login.
        router.replace('/');
      }
    }
  }, [currentUser, dispatch, router]);

  // 2. Initial Data Load
  useEffect(() => {
    if (currentUser) {
      dispatch(loadUsers());
    }
  }, [currentUser, dispatch]);

  // 3. Notification Logic
  // Watch for new messages to trigger toast
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      // If message is for me, AND it's NOT from the person I'm currently looking at
      if (
        lastMsg.recipient === currentUser && 
        lastMsg.sender !== currentUser &&
        lastMsg.sender !== selectedUsername
      ) {
        setNotification({ 
          sender: lastMsg.sender, 
          content: lastMsg.content 
        });
        
        // Play a subtle sound (optional)
        // new Audio('/notification.mp3').play().catch(() => {});
      }
    }
  }, [messages, currentUser, selectedUsername]);

  // --- Data Transformation for UI ---

  // Convert Redux "onlineUsers" to the format UserList component expects
  // We map the string list or partial objects to full User objects
  const uiUsers = useMemo(() => {
    return onlineUsers
      .filter(u => u.username !== currentUser) // Don't show myself
      .map(u => ({
        id: u.username, // Using username as ID for simplicity
        username: u.username,
        isOnline: u.isOnline,
        lastSeen: new Date(), // You could track real lastSeen in DB if extended
        // Calculate unread count (simple session-based count)
        unreadCount: messages.filter(
          m => m.sender === u.username && m.recipient === currentUser && selectedUsername !== u.username
        ).length
      }));
  }, [onlineUsers, currentUser, messages, selectedUsername]);

  // Find the full User object for the selected username
  const selectedUserObj = useMemo(() => {
    if (!selectedUsername) return null;
    const user = uiUsers.find(u => u.username === selectedUsername);
    return user || { id: selectedUsername, username: selectedUsername, isOnline: false };
  }, [selectedUsername, uiUsers]);

  // Filter messages for the current conversation
  const currentChatMessages = useMemo(() => {
    if (!selectedUsername) return [];
    return messages
      .filter(
        (m) => 
          (m.sender === currentUser && m.recipient === selectedUsername) ||
          (m.sender === selectedUsername && m.recipient === currentUser)
      )
      .map(m => ({
        // Adapt Redux message to UI Message interface
        id: m._id || Math.random().toString(), // Handle DB ID vs Temp ID
        senderId: m.sender === currentUser ? 'me' : m.sender,
        senderName: m.sender,
        receiverId: m.recipient,
        content: m.content,
        timestamp: new Date(m.createdAt || Date.now()),
        isRead: true
      }));
  }, [messages, currentUser, selectedUsername]);

  // --- Handlers ---

  const handleLogout = () => {
    dispatch(logout()); // The middleware will handle socket.disconnect()
    router.replace('/');
  };

  const handleSelectUser = (user: any) => {
    dispatch(selectUser(user.username));
    // Fetch history from API
    if (currentUser) {
      dispatch(loadHistory({ user1: currentUser, user2: user.username }));
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUsername || !currentUser) return;

    // 1. Emit to Socket Server
    emitMessage(selectedUsername, content);

    // 2. Optimistic Update (Show it immediately in UI)
    dispatch(addMessage({
      sender: currentUser,
      recipient: selectedUsername,
      content: content,
      createdAt: new Date().toISOString()
    }));
  };

  if (!currentUser) return null; // Prevent flash before redirect

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar User List */}
      <UserList
        users={uiUsers}
        currentUser={currentUser}
        selectedUser={selectedUserObj}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        totalUnread={uiUsers.reduce((acc, user) => acc + (user.unreadCount || 0), 0)}
      />

      {/* Main Chat Area */}
      <ChatArea
        selectedUser={selectedUserObj}
        messages={currentChatMessages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />

      {/* Pop-up Notification */}
      {notification && (
        <NotificationToast
          sender={notification.sender}
          message={notification.content}
          onClose={() => setNotification(null)}
          onClick={() => {
            handleSelectUser({ username: notification.sender });
            setNotification(null);
          }}
        />
      )}
    </div>
  );
}