'use client';
import DayNav from '@/components/date/DayNav';
import YearMonthNav from '@/components/date/YearMonthNav';
import { eventsAtom } from '@/store/event';
import { notesAtom } from '@/store/note';
import { tasksAtom } from '@/store/task';
import { useAtomValue } from 'jotai';

import { goalsAtom } from '@/store/goals';
import { todayAtom } from '@/store/ui';
import { getDashDate } from '@/util/date';
import ListItem from '../../_components/ListItem';

import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import Loader from '@/components/loader/Loader';

dayjs.extend(utc);

const Page = () => {
  const today = useAtomValue(todayAtom);

  const { data: tasks, isFetching: isFetchingTasks } = useAtomValue(tasksAtom);
  const { data: events, isFetching: isFetchingEvents } = useAtomValue(eventsAtom);
  const { data: notes, isFetching: isFetchingNotes } = useAtomValue(notesAtom);
  const { data: goals, isFetching: isFetchingGoals } = useAtomValue(goalsAtom);

  return (
    <div className="h-full p-14 space-y-10">
      {/* Header */}
      <div className="mt-4 flex justify-between">
        <YearMonthNav />
        <DayNav />
      </div>
      <ul
        className={`${
          isFetchingTasks || isFetchingEvents || isFetchingNotes || isFetchingGoals
            ? 'h-[80%]'
            : ''
        } space-y-6`}
      >
        {isFetchingTasks || isFetchingEvents || isFetchingNotes || isFetchingGoals ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          notes
            ?.filter((note) => getDashDate(note.date) === getDashDate(today))
            ?.map((note) => <ListItem key={note.id} {...note} />)
        )}
        {events
          ?.filter((event) => getDashDate(event.date) === getDashDate(today))
          ?.map((event) => (
            <ListItem key={event.id} {...event} />
          ))}
        {tasks
          ?.filter((task) => {
            if (
              task.status !== 'done' &&
              task.status !== 'dismissed' &&
              task.date &&
              getDashDate(task.date) === getDashDate(today)
            ) {
              return true;
            }
          })
          ?.map((task) => (
            <ListItem key={task.id} {...task} />
          ))}
      </ul>
      {!!(
        goals
          ?.filter(
            (goal) =>
              goal.isPinned && goal.status !== 'done' && goal.status !== 'dismissed'
          )
          ?.map((goal) => <ListItem key={goal.id} {...goal} />).length ||
        tasks?.filter(
          (task) =>
            task.status !== 'done' &&
            task.status !== 'dismissed' &&
            task.isPinned &&
            (!task.date || getDashDate(task.date) !== getDashDate(today))
        ).length
      ) && (
        <ul className="box-content w-full ml-[-1.5rem] space-y-4 p-6 bg-gray-50 rounded-xl">
          {goals
            ?.filter(
              (goal) =>
                goal.isPinned && goal.status !== 'done' && goal.status !== 'dismissed'
            )
            ?.map((goal) => (
              <ListItem key={goal.id} {...goal} />
            ))}
          {tasks
            ?.filter(
              (task) =>
                task.status !== 'done' &&
                task.status !== 'dismissed' &&
                task.isPinned &&
                (!task.date || getDashDate(task.date) !== getDashDate(today))
            )
            ?.map((task) => (
              <ListItem key={task.id} {...task} />
            ))}
          {events
            ?.filter(
              (event) =>
                event.isPinned &&
                event.date &&
                getDashDate(event.date) &&
                new Date(getDashDate(event.date)!) >= new Date(getDashDate(new Date())!)
            )
            ?.map((event) => (
              <ListItem key={event.id} {...event} />
            ))}
          {notes
            ?.filter((goal) => goal.isPinned)
            ?.map((note) => (
              <ListItem key={note.id} {...note} />
            ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
