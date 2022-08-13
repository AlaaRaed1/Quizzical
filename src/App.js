import React, {useState} from 'react'
import './App.css';
import StartGame from './Components/StartGame'
import Quiz from './Components/Quiz'
function App() {
  const [isHome, setIsHome] = React.useState(true);
  const [formData, setFormData] = useState({
    category: '9',
    difficulty: '',
    answerType: '',
    amountOfQuestions: '5'
})
  function startQuiz() {
    setIsHome(prev => !prev)
}


function handleFormChange(e) {
  const {name, value} = e.target;
  
  setFormData(prev => {
      return {
          ...prev, [name] : value
      }
  })
}
   
  return (
    <div className="App">
      {isHome ? <StartGame 
      formData={formData}
      handleFormChange={handleFormChange}
      startQuiz={startQuiz}
      /> : 
      <Quiz 
      startQuiz={startQuiz}
      formData={formData}
      
      />}
    </div>
  );
}

export default App;
