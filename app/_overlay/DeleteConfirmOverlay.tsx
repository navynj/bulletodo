'use client';

import OverlayForm from '@/components/overlay/OverlayForm';
import { eventsAtom } from '@/store/event';
import { goalsAtom } from '@/store/goals';
import { notesAtom } from '@/store/note';
import { tasksAtom } from '@/store/task';
import { mainFormDataAtom } from '@/store/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaCircleExclamation } from 'react-icons/fa6';
import * as z from 'zod';
const formSchema = z.object({});

type schemaType = z.infer<typeof formSchema>;

const TaskDateInputOverlay = ({ z: zIndex }: { z?: number }) => {
  const router = useRouter();
  const pathname = usePathname();

  const defaultValues = useAtomValue(mainFormDataAtom);
  const { refetch: refetchProjects } = useAtomValue(tasksAtom);
  const { refetch: refetchGoals } = useAtomValue(goalsAtom);
  const { refetch: refetchTasks } = useAtomValue(tasksAtom);
  const { refetch: refetchEvents } = useAtomValue(eventsAtom);
  const { refetch: refetchNotes } = useAtomValue(notesAtom);

  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${defaultValues?.type}/${defaultValues?.id}`,
        {
          method: 'DELETE',
        }
      );

      router.back();

      if (pathname.includes('goal') && defaultValues?.type === 'goal') {  
        router.back();
      }

      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
      }

      refetch(defaultValues?.type);
    } catch (error) {
      console.error(error);
    }
  };

  const refetch = (type?: string) => {
    switch (type) {
      case 'project':
        refetchProjects();
        break;
      case 'goal':
        refetchGoals();
        break;
      case 'task':
        refetchTasks();
        break;
      case 'event':
        refetchEvents();
        break;
      case 'note':
        refetchNotes();
        break;
      default:
        refetchProjects();
        refetchGoals();
        refetchTasks();
        refetchEvents();
        refetchNotes();
    }
  };

  return (
    <OverlayForm<schemaType>
      id="delete-confirm"
      form={form}
      onSubmit={submitHandler}
      saveStr="Delete"
      z={zIndex}
      className="flex flex-col items-center text-center py-6"
    >
      <FaCircleExclamation className="text-3xl" />
      <h3 className="text-2xl font-extrabold mb-3">Are you sure?</h3>
      <p className="leading-tight">
        Are you sure you want to delete this? <br />
        This process cannot be undone.
      </p>
    </OverlayForm>
  );
};

export default TaskDateInputOverlay;
