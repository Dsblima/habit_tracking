import { useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors';
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";

const weekDays = ['Domingo',
                  'Segunda-feira',
                  'Terça-feira',
                  'Quarta-feira',
                  'Quinta-feira',
                  'Sexta-feira',
                  'Sábado'
                ]

export function New() {
  const [weekDaysChecked, setWeekDaysChecked] = useState<number[]>([])

  function handleToggleWeekDay( weekDayIndex: number) { console.log('Funcionou')
    if (weekDaysChecked.includes(weekDayIndex)) {
      setWeekDaysChecked(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setWeekDaysChecked(prevState => [...prevState, weekDayIndex])
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16 ">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >

        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar Hábito
        </Text>
        
        <Text className="mt-6 text-white font-semibold text-base">
          Qual hábito deseja registrar?
        </Text>

        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Ler, exercício, correr, etc..."
          placeholderTextColor={colors.zinc[400]}
        />
        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a frequencia?
        </Text>
        {
          weekDays.map((weekDay, index) => (
            <CheckBox 
              title={weekDay}
              key={index}
              checked={weekDaysChecked.includes(index)}
              onPress={() => handleToggleWeekDay(index)}
            />
          ))
        }

        <TouchableOpacity 
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}