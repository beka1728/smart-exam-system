import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  role: string;
  sessionId?: string;
}

export class ExamWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('WebSocket connection established');
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        // Remove client from connections
        for (const [clientId, client] of this.clients.entries()) {
          if (client.ws === ws) {
            this.clients.delete(clientId);
            break;
          }
        }
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private async handleMessage(ws: WebSocket, message: any) {
    const { type, ...payload } = message;

    switch (type) {
      case 'authenticate':
        await this.handleAuthenticate(ws, payload);
        break;
      case 'join_session':
        await this.handleJoinSession(ws, payload);
        break;
      case 'student_activity':
        await this.handleStudentActivity(ws, payload);
        break;
      case 'proctor_action':
        await this.handleProctorAction(ws, payload);
        break;
      case 'time_update':
        await this.handleTimeUpdate(ws, payload);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  private async handleAuthenticate(ws: WebSocket, payload: any) {
    try {
      const { token } = payload;
      
      // In a real implementation, verify JWT token
      // For now, extract user info from token payload
      const decoded = jwt.decode(token) as any;
      if (!decoded) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
        return;
      }

      const user = await storage.getUser(decoded.userId);
      if (!user) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'User not found' }));
        return;
      }

      const clientId = `${user.id}-${Date.now()}`;
      this.clients.set(clientId, {
        ws,
        userId: user.id,
        role: user.role || 'student',
      });

      ws.send(JSON.stringify({ 
        type: 'authenticated', 
        clientId,
        user: { id: user.id, role: user.role }
      }));

    } catch (error) {
      console.error('Authentication error:', error);
      ws.send(JSON.stringify({ type: 'auth_error', message: 'Authentication failed' }));
    }
  }

  private async handleJoinSession(ws: WebSocket, payload: any) {
    const { sessionId } = payload;
    const client = Array.from(this.clients.values()).find(c => c.ws === ws);
    
    if (!client) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
      return;
    }

    client.sessionId = sessionId;
    ws.send(JSON.stringify({ type: 'session_joined', sessionId }));
  }

  private async handleStudentActivity(ws: WebSocket, payload: any) {
    const client = Array.from(this.clients.values()).find(c => c.ws === ws);
    
    if (!client || client.role !== 'student') {
      return;
    }

    const { sessionId, activity } = payload;
    
    // Log activity for proctoring
    if (sessionId) {
      await storage.addFlaggedActivity(sessionId, {
        type: activity.type,
        data: activity.data,
        timestamp: new Date(),
        studentId: client.userId,
      });
    }

    // Notify proctors
    this.broadcastToProctors({
      type: 'student_activity',
      sessionId,
      studentId: client.userId,
      activity,
    });
  }

  private async handleProctorAction(ws: WebSocket, payload: any) {
    const client = Array.from(this.clients.values()).find(c => c.ws === ws);
    
    if (!client || (client.role !== 'proctor' && client.role !== 'instructor')) {
      return;
    }

    const { action, targetSessionId, data } = payload;

    switch (action) {
      case 'pause_session':
        await storage.updateSessionStatus(targetSessionId, 'paused');
        this.sendToStudent(targetSessionId, {
          type: 'session_paused',
          message: 'Your exam has been paused by the proctor',
        });
        break;
      case 'resume_session':
        await storage.updateSessionStatus(targetSessionId, 'active');
        this.sendToStudent(targetSessionId, {
          type: 'session_resumed',
          message: 'Your exam has been resumed',
        });
        break;
      case 'terminate_session':
        await storage.updateSessionStatus(targetSessionId, 'terminated');
        this.sendToStudent(targetSessionId, {
          type: 'session_terminated',
          message: 'Your exam has been terminated',
        });
        break;
    }
  }

  private async handleTimeUpdate(ws: WebSocket, payload: any) {
    const client = Array.from(this.clients.values()).find(c => c.ws === ws);
    
    if (!client || client.role !== 'student') {
      return;
    }

    const { sessionId, timeRemaining } = payload;
    await storage.updateSessionTime(sessionId, timeRemaining);
  }

  private broadcastToProctors(message: any) {
    for (const client of this.clients.values()) {
      if ((client.role === 'proctor' || client.role === 'instructor') && 
          client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }

  private sendToStudent(sessionId: string, message: any) {
    for (const client of this.clients.values()) {
      if (client.sessionId === sessionId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        break;
      }
    }
  }

  broadcast(message: any) {
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }
}
