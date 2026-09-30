# 🚀 Nexus Match — Project Overview & Technical Handover Document

> **Use this document to explain the project to any Human developer, tech lead, interviewer, or AI assistant.**

---

## 📌 1. Executive Summary & Vision

**Nexus Match** is an **Omegle-style 1-on-1 Realtime Video & Audio Matchmaking Platform** built with an **Apple Light Aesthetic UI/UX Design**.

Unlike standard random video chat apps, Nexus Match allows users to specify **deep matching filters**:
- **Target Gender Preference** (e.g., Boys looking for Girls, Girls looking for Boys, or Anyone).
- **Location Preference** (e.g., Same City like Delhi/Gurugram, Same State, or Worldwide).
- **Height Filter Range** (e.g., 5'0" – 6'2").
- **Interest Tags Overlap** (e.g., Music, Tech, Gaming, Travel, Fitness).

The platform uses a **Weighted Queue Algorithm** to pair users in sub-seconds and establish low-latency **Peer-to-Peer WebRTC Video Connections**.

---

## 🏛️ 2. Master System Architecture (17 Controllers, 14 Middleware, 20 Models)

The application follows a **1-to-1 Decoupled Architecture** where REST controllers and WebSockets share common business services.

```
+------------------------------------------------------------------------------------+
| 17 CONTROLLERS & 17 ROUTES (1-to-1 Mapping)                                         |
| 1. auth (/api/auth)               2. verification (/api/auth)                      |
| 3. session (/api/sessions)         4. profile (/api/profile)                        |
| 5. preference (/api/preferences)   6. interest (/api/interests)                   |
| 7. call (/api/calls)               8. report (/api/reports)                        |
| 9. block (/api/blocks)            10. appeal (/api/appeals)                        |
| 11. notification (/api/notif)     12. support (/api/support)                       |
| 13. admin.user (/api/admin/users) 14. admin.moderation (/api/admin/moderation)    |
| 15. admin.analytics (/api/stats)  16. admin.config (/api/admin/config)             |
| 17. health (/health)                                                               |
+------------------------------------------------------------------------------------+
| 14 MIDDLEWARE MODULES                                                              |
| 1. authenticate   2. requireRole   3. checkBanned     4. validate               |
| 5. rateLimiter    6. errorHandler  7. notFound        8. upload                 |
| 9. sanitize      10. requestLogger 11. auditLogger    12. socketAuth            |
| 13. socketRateLimiter              14. requireProfileComplete                      |
+------------------------------------------------------------------------------------+
| SOCKETS ARCHITECTURE (backend/src/sockets/)                                       |
| matchmaking.socket.js  -> queue:join, queue:leave, match:found                    |
| signaling.socket.js    -> webrtc:offer, webrtc:answer, webrtc:ice                |
| call.socket.js         -> call:next, call:skip, call:end, call:disconnect        |
| chat.socket.js         -> chat:send, chat:receive                                 |
| presence.socket.js     -> user:online, user:offline, heartbeat                    |
+------------------------------------------------------------------------------------+
```

---

## 🎨 3. Apple UI/UX Design System Rules

All frontend components strictly follow **[APPLE_DESIGN_SYSTEM.md](./APPLE_DESIGN_SYSTEM.md)**:

1. **Background**: Signature Apple off-white (`bg-[#F5F5F7]`).
2. **Cards**: Crisp white surfaces (`bg-white`) with soft ambient shadows (`shadow-2xl shadow-neutral-200/80`) and fine borders (`border-neutral-200`).
3. **Typography**: Charcoal text (`text-neutral-900`), muted secondary gray (`text-neutral-500`), tight tracking (`tracking-tight`).
4. **Pill Buttons**: Signature full-rounded pills (`rounded-full`), black primary buttons (`bg-black text-white hover:bg-neutral-800 active:scale-95`).
5. **Dropdowns**: Seamless text lists without card borders or box backgrounds (`text-left`, `text-neutral-600` → `hover:text-black`).

---

## 💡 4. Guidelines for Human Developers & AI Assistants

When reading or building in this repository:
1. Refer to **`implementation_plan.md`** for full 1-to-1 route mapping, 14 middleware specs, and Socket event handlers.
2. Business logic must be written inside `services/` and never directly inside Controllers or Socket Handlers.
3. Every file must be self-documenting with clean, human-readable variable names and comments.
