import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const TASKS_COLLECTION = 'tasks';

/**
 * Subscribes in real-time to tasks belonging exclusively to `userId`.
 */
export function subscribeToUserTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          title: data.title || '',
          description: data.description || '',
          completed: Boolean(data.completed),
          priority: data.priority || 'medium',
          dueDate: data.dueDate || '',
          order: typeof data.order === 'number' ? data.order : 0,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      });
      onData(tasks);
    },
    (err) => {
      onError(err);
    }
  );
}

/**
 * Creates a new task for the given user in Firestore.
 */
export async function createTask(userId: string, input: CreateTaskInput, highestOrder = 0): Promise<string> {
  const now = new Date().toISOString();
  const newTaskData = {
    userId,
    title: input.title.trim(),
    description: (input.description || '').trim(),
    completed: false,
    priority: input.priority || 'medium',
    dueDate: input.dueDate || '',
    order: highestOrder + 1,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTaskData);
  return docRef.id;
}

/**
 * Updates an existing task by ID.
 */
export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const now = new Date().toISOString();

  const updateData: Record<string, any> = {
    updatedAt: now,
  };

  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) updateData.description = input.description.trim();
  if (input.completed !== undefined) updateData.completed = input.completed;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
  if (input.order !== undefined) updateData.order = input.order;

  await updateDoc(taskRef, updateData);
}

/**
 * Toggles completion status of a task.
 */
export async function toggleTaskComplete(taskId: string, currentCompleted: boolean): Promise<void> {
  await updateTask(taskId, { completed: !currentCompleted });
}

/**
 * Deletes a task from Firestore.
 */
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}

/**
 * Updates orders of multiple tasks in batch.
 */
export async function updateTasksOrder(orderedTasks: { id: string; order: number }[]): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  orderedTasks.forEach(({ id, order }) => {
    const taskRef = doc(db, TASKS_COLLECTION, id);
    batch.update(taskRef, { order, updatedAt: now });
  });

  await batch.commit();
}