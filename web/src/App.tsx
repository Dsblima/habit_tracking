import { Habit } from "./components/Habit"

function App() {
 
  return (
    <div>
      <Habit completed={2} />
      <Habit completed={3} />
      <Habit completed={7} />
      <Habit completed={3} />
      <Habit completed={4} />
      <Habit completed={5} />
    </div>
  )
}

export default App
