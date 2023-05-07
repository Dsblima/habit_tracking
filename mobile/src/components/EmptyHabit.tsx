import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function EmptyHabit() {
  const { navigate } = useNavigation()

  return (
    <Text className="text-zinc-400 text-base">
      Não Existem hábitos cadastrados para esse dia.{' '}

      <Text 
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate('new')}>
        Comece cadastrando um.
      </Text>
    </Text>
  );
}