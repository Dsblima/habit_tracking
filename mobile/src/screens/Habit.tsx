import { ScrollView, View, Text, Alert} from "react-native";
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from "react";

import {generateProgressPercentage} from '../utils/generate-progress-percentage';
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { api } from "../lib/axios";

import { EmptyHabit } from "../components/EmptyHabit";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute();
  const { date } = route.params as Params;
  const parseDate = dayjs(date);
  const isDateInPast = parseDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parseDate.format('dddd');
  const dayAndMonth = parseDate.format('DD/MM')  

  const habitProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get('/day', {params: {date}})
      setDayInfo(response.data)      
      setCompletedHabits(response.data.completedHabits)
    } catch (error) {
      console.log(error)
      Alert.alert("Eita","Não foi possível carregar as informações dos hábitos")
    } finally {
      setLoading(false)      
    }
  }

  async function handleToggleHabit(habitId: string) {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))      
    } else {
      setCompletedHabits(prevState => [...prevState, habitId])
    }

    await api.patch(`/habits/${habitId}/toggle`)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16 ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitProgress}/>

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits ?
            dayInfo?.possibleHabits.map(habit => (
              <CheckBox
                key={habit.id} 
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
            : <EmptyHabit />
          }
          
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode atualizar hábitos de uma data que já passou.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}