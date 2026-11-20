import { useCallback, useEffect, useState } from 'react';
import {
  SAMPLE_CALENDAR_EVENTS,
  compareEvents,
  type CalendarEvent,
} from '../../data/calendar';
import {
  createCalendarEvent,
  deleteCalendarEvent,
  seedCalendarEvents,
  setCalendarConnection,
  subscribeCalendarConnection,
  subscribeCalendarEvents,
} from '../../lib/calendarStore';

const DEMO_STORAGE_KEY = 'vido-demo-calendar-v1';

interface DemoCalendarState {
  connected: boolean;
  events: CalendarEvent[];
}

function loadDemoCalendar(): DemoCalendarState {
  if (typeof window === 'undefined') {
    return { connected: false, events: SAMPLE_CALENDAR_EVENTS };
  }
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoCalendarState>;
      return {
        connected: parsed.connected === true,
        events: Array.isArray(parsed.events)
          ? parsed.events
          : SAMPLE_CALENDAR_EVENTS,
      };
    }
  } catch {
    // Fall back to a fresh demo calendar.
  }
  return { connected: false, events: SAMPLE_CALENDAR_EVENTS };
}

export interface CalendarState {
  events: CalendarEvent[];
  connected: boolean;
  ready: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  addEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

/**
 * Local "Google Calendar" integration. In live mode events are per-user
 * Firestore documents; in the demo they are stored in localStorage.
 */
export function useCalendar(
  uid?: string | null,
  mode: 'demo' | 'live' = 'demo'
): CalendarState {
  const [demoState, setDemoState] = useState<DemoCalendarState>(loadDemoCalendar);
  const [liveEvents, setLiveEvents] = useState<CalendarEvent[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const [eventsReady, setEventsReady] = useState(false);
  const [connectionReady, setConnectionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoState));
  }, [demoState]);

  useEffect(() => {
    if (mode !== 'live' || !uid) return;

    let active = true;
    setEventsReady(false);
    setConnectionReady(false);
    setError(null);

    const unsubscribeEvents = subscribeCalendarEvents(
      uid,
      (events) => {
        if (!active) return;
        setLiveEvents([...events].sort(compareEvents));
        setEventsReady(true);
      },
      (eventError) => {
        if (!active) return;
        setError(eventError.message);
        setEventsReady(true);
      }
    );

    const unsubscribeConnection = subscribeCalendarConnection(
      uid,
      (connected) => {
        if (!active) return;
        setLiveConnected(connected);
        setConnectionReady(true);
      },
      (connectionError) => {
        if (!active) return;
        setError(connectionError.message);
        setConnectionReady(true);
      }
    );

    return () => {
      active = false;
      unsubscribeEvents();
      unsubscribeConnection();
    };
  }, [mode, uid]);

  const connect = useCallback(async () => {
    setError(null);
    if (mode !== 'live' || !uid) {
      setDemoState((prev) => ({ ...prev, connected: true }));
      return;
    }
    try {
      await setCalendarConnection(uid, true);
      await seedCalendarEvents(uid);
    } catch (connectError) {
      setError((connectError as Error).message);
      throw connectError;
    }
  }, [mode, uid]);

  const disconnect = useCallback(async () => {
    setError(null);
    if (mode !== 'live' || !uid) {
      setDemoState((prev) => ({ ...prev, connected: false }));
      return;
    }
    try {
      await setCalendarConnection(uid, false);
    } catch (disconnectError) {
      setError((disconnectError as Error).message);
      throw disconnectError;
    }
  }, [mode, uid]);

  const addEvent = useCallback(
    async (event: CalendarEvent) => {
      setError(null);
      if (mode !== 'live' || !uid) {
        setDemoState((prev) => ({
          ...prev,
          events: [...prev.events, event].sort(compareEvents),
        }));
        return;
      }
      try {
        await createCalendarEvent(uid, event);
      } catch (writeError) {
        setError((writeError as Error).message);
        throw writeError;
      }
    },
    [mode, uid]
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      setError(null);
      if (mode !== 'live' || !uid) {
        setDemoState((prev) => ({
          ...prev,
          events: prev.events.filter((event) => event.id !== eventId),
        }));
        return;
      }
      try {
        await deleteCalendarEvent(uid, eventId);
      } catch (writeError) {
        setError((writeError as Error).message);
        throw writeError;
      }
    },
    [mode, uid]
  );

  if (mode === 'live') {
    return {
      events: liveEvents,
      connected: liveConnected,
      ready: eventsReady && connectionReady,
      error,
      connect,
      disconnect,
      addEvent,
      deleteEvent,
    };
  }

  return {
    events: demoState.events,
    connected: demoState.connected,
    ready: true,
    error,
    connect,
    disconnect,
    addEvent,
    deleteEvent,
  };
}
