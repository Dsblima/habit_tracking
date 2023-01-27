import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { api } from '../lib/axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface HabitListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void
}

interface HabitInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[],
  completedHabits: string[]
}

export function HabitList({ date, onCompletedChanged }: HabitListProps) {
  const [habitInfo, setHabitInfo] = useState<HabitInfo>()
  const isBeforaToday = dayjs(date).endOf('day').isBefore(new Date())

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString(),
      }
    }).then(response => {
      setHabitInfo(response.data)
    })
  }, [])

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAreadyCompleted = habitInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = []
    if (isHabitAreadyCompleted) {
      completedHabits = habitInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitInfo!.completedHabits, habitId]
    }

    setHabitInfo({
      possibleHabits: habitInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length)
  }

  return (
    <div className='mt-6 -ml-5 flex flex-col gap-3'>
      {
        habitInfo?.possibleHabits.map(habit => {
          return (
            <Checkbox.Root
              key={habit.id}
              defaultChecked={habitInfo.completedHabits.includes(habit.id)}
              onCheckedChange={() => handleToggleHabit(habit.id)}
              disabled={isBeforaToday}
              className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-500'>
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })
      }


    </div>
  )
}