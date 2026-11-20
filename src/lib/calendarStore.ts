import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { userDocument } from './userDocument';
import { SAMPLE_CALENDAR_EVENTS, type CalendarEvent } from '../data/calendar';

const eventsCollection = (uid: string) =>
  collection(db, 'users', uid, 'calendarEvents');
const eventDocument = (uid: string, eventId: string) =>
  doc(db, 'users', uid, 'calendarEvents', eventId);

export function subscribeCalendarEvents(
  uid: string,
  next: (events: CalendarEvent[]) => void,
  onError: (error: Error) => void
) {
  return onSnapshot(
    eventsCollection(uid),
    (snapshot) => {
      const events = snapshot.docs.map(
        (entry) => entry.data() as CalendarEvent
      );
      next(events);
    },
    onError
  );
}

export function subscribeCalendarConnection(
  uid: string,
  next: (connected: boolean) => void,
  onError: (error: Error) => void
) {
  return onSnapshot(
    userDocument(uid),
    (snapshot) => next(snapshot.data()?.calendarConnected === true),
    onError
  );
}

/** Seeds sample events once when an account first connects its calendar. */
export async function seedCalendarEvents(uid: string) {
  const batch = writeBatch(db);
  SAMPLE_CALENDAR_EVENTS.forEach((event) => {
    batch.set(eventDocument(uid, event.id), event);
  });
  await batch.commit();
}

export async function setCalendarConnection(uid: string, connected: boolean) {
  await setDoc(userDocument(uid), { calendarConnected: connected }, { merge: true });
}

export async function createCalendarEvent(uid: string, event: CalendarEvent) {
  await setDoc(eventDocument(uid, event.id), event);
}

export async function deleteCalendarEvent(uid: string, eventId: string) {
  await deleteDoc(eventDocument(uid, eventId));
}
