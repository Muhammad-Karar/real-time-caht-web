Realtime Chat Application
Next.js + MERN + Socket.IO

1. Project Overview
This project is a self-hosted, real-time one-to-one chat application built using Next.js and the MERN stack.
It is intentionally designed to demonstrate core real-time system engineering fundamentals, rather than UI complexity or third-party abstractions.
The application allows users to:
•	Join the system using a simple username (no authentication)
•	View other online users in real time
•	Exchange one-to-one messages instantly
•	Receive real-time message notifications
•	Track online and offline user presence
•	Load previous chat history between two users
All real-time functionality is implemented manually using Socket.IO (self-hosted), without relying on any managed or hosted real-time services.

2. Architecture Explanation
The system follows a client–server architecture with a clear and deliberate separation of concerns.
High-Level Components
Frontend
•	Next.js (App Router)
•	React Hooks for state and lifecycle management
•	Socket.IO client for real-time communication
Backend
•	Express.js REST API for persistent data access
•	Socket.IO server for real-time events
•	MongoDB for message persistence
•	In-memory data structures for online presence tracking
Architecture Principles
Persistent data (messages) is stored in MongoDB
Volatile state (online users, socket connections) is stored in memory
Real-time events are handled exclusively via Socket.IO
Historical data retrieval is handled via HTTP APIs
This separation improves clarity, performance, and maintainability while keeping the real-time layer focused and efficient.

3. Technology Stack
Frontend
•	Next.js (App Router)
•	React
•	TypeScript
•	Tailwind CSS
•	Socket.IO client
Backend
•	Node.js
•	Express.js
•	MongoDB
•	Mongoose
•	Socket.IO (self-hosted)

4. Real-Time Communication Flow
4.1 User Join
1.	The user enters a username
2.	The frontend establishes a Socket.IO connection
3.	The username is sent to the server
4.	The server:
o	Stores the username → socketId mapping in memory
o	Broadcasts the updated online users list to all clients

4.2 Sending a Message
1.	A user sends a message to another user
2.	The message is emitted via Socket.IO
3.	The server:
o	Persists the message in MongoDB
o	Routes the message to the recipient’s socket
o	Emits a real-time notification event

4.3 Receiving a Message
1.	The recipient receives the message instantly via Socket.IO
2.	The UI updates without a page refresh
3.	A notification indicator is displayed

4.4 Disconnect / Offline
1.	The user closes the tab or disconnects
2.	The Socket.IO disconnect event is triggered
3.	The server:
o	Removes the user from the in-memory store
o	Broadcasts the updated presence status
5. Database Schema
Message Schema (MongoDB)
{
  "_id": "694bcefad35249ccdf0508ad",
  "sender": "Karar",
  "recipient": "Aun",
  "content": "hi?",
  "isRead": false,
  "createdAt": "2025-12-24T11:31:06.799+00:00",
  "updatedAt": "2025-12-24T11:31:06.799+00:00"
}
Design Rationale
•	Messages are persisted to support chat history
•	Online presence is not stored in the database because it is ephemeral and connection-based

6. API Endpoints
Fetch Chat History
GET /api/messages/:user1/:user2
Purpose
•	Retrieves previous messages between two users
•	Keeps Socket.IO communication focused strictly on real-time events

7. Online Presence Handling Logic
In-Memory Data Structure
Map<username, socketId>
Why In-Memory?
•	Presence data is temporary and connection-driven
•	Faster than database lookups
•	Automatically resets on server restart, which is expected behavior
Presence Events
•	user:online
•	user:offline
•	users:update





8. Socket.IO Lifecycle Management
Connection
•	A socket connection is created when a user joins
•	The username is bound to the socket ID
Message Routing
•	Messages are routed using the username → socketId mapping
•	This avoids unnecessary broadcasts and ensures targeted delivery
Cleanup
•	On disconnect:
o	Remove the socket mapping from memory
o	Update the online users list
o	Broadcast the updated presence state

9. Scaling Considerations
This implementation uses in-memory state, which is appropriate for a single server instance.
Limitations with Multiple Servers
•	Each server maintains its own memory
•	Users connected to different instances cannot see each other’s presence
•	Message routing would be inconsistent across instances
Production-Level Scaling Approach
•	Introduce a shared state layer (e.g., Redis)
•	Use a Socket.IO adapter for cross-instance communication
•	Enable sticky sessions or centralized presence coordination
 
10. How to Run the Project Locally
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
MongoDB must be running locally or accessible via a connection string.

