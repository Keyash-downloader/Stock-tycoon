import { useState, useEffect, useRef, useCallback } from 'react';
import { ChallengeRoom, PublicRoomSummary, ChallengeType } from '../types/multiplayer';

export type SocketStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export function useMultiplayerSocket() {
  const [status, setStatus] = useState<SocketStatus>('CONNECTING');
  const [rooms, setRooms] = useState<PublicRoomSummary[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChallengeRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setStatus('CONNECTED');
        setErrorMessage(null);
        // Request open challenge rooms
        ws.send(JSON.stringify({ type: 'GET_ROOMS' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'ROOMS_LIST':
              setRooms(data.rooms || []);
              break;
            case 'ROOM_JOINED':
              setCurrentRoom(data.room);
              setPlayerId(data.playerId);
              break;
            case 'ROOM_UPDATED':
              setCurrentRoom(data.room);
              break;
            case 'LEFT_ROOM':
              setCurrentRoom(null);
              setPlayerId(null);
              break;
            case 'ERROR':
              setErrorMessage(data.message || 'Multiplayer error');
              break;
          }
        } catch (err) {
          console.warn('Failed to parse WebSocket message', err);
        }
      };

      ws.onclose = () => {
        setStatus('DISCONNECTED');
        socketRef.current = null;
        // Schedule auto-reconnect
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
      };

      socketRef.current = ws;
    } catch (err) {
      console.warn('WebSocket init exception:', err);
      setStatus('DISCONNECTED');
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((message: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      setErrorMessage('Cannot send: server is currently disconnected.');
    }
  }, []);

  const refreshRooms = useCallback(() => {
    send({ type: 'GET_ROOMS' });
  }, [send]);

  const createRoom = useCallback(
    (params: {
      playerName: string;
      firmTitle?: string;
      avatar?: string;
      roomName?: string;
      challengeType: ChallengeType;
      startingCash?: number;
      totalRounds?: number;
      isPublic?: boolean;
    }) => {
      send({
        type: 'CREATE_ROOM',
        ...params,
      });
    },
    [send]
  );

  const joinRoom = useCallback(
    (roomId: string, playerName: string, firmTitle?: string, avatar?: string) => {
      send({
        type: 'JOIN_ROOM',
        roomId,
        playerName,
        firmTitle,
        avatar,
      });
    },
    [send]
  );

  const addBotRival = useCallback(() => {
    send({ type: 'ADD_BOT_RIVAL' });
  }, [send]);

  const toggleReady = useCallback(() => {
    send({ type: 'TOGGLE_READY' });
  }, [send]);

  const startChallenge = useCallback(() => {
    send({ type: 'START_CHALLENGE' });
  }, [send]);

  const executeTrade = useCallback(
    (symbol: string, shares: number, tradeType: 'LONG' | 'SHORT', leverage: number = 1) => {
      send({
        type: 'EXECUTE_TRADE',
        symbol,
        shares,
        tradeType,
        leverage,
      });
    },
    [send]
  );

  const closePosition = useCallback(
    (symbol: string) => {
      send({
        type: 'CLOSE_POSITION',
        symbol,
      });
    },
    [send]
  );

  const advanceRound = useCallback(() => {
    send({ type: 'ADVANCE_ROUND' });
  }, [send]);

  const sendChat = useCallback(
    (text: string) => {
      send({
        type: 'SEND_CHAT',
        text,
      });
    },
    [send]
  );

  const leaveRoom = useCallback(() => {
    send({ type: 'LEAVE_ROOM' });
  }, [send]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    status,
    rooms,
    currentRoom,
    playerId,
    errorMessage,
    clearError,
    refreshRooms,
    createRoom,
    joinRoom,
    addBotRival,
    toggleReady,
    startChallenge,
    executeTrade,
    closePosition,
    advanceRound,
    sendChat,
    leaveRoom,
  };
}
