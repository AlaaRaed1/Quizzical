import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Question from "./Question";
import yellowBlob from "../assets/blob5.svg";
import blueBlob from "../assets/blob6.svg";
function Quiz(props) {
  const [quizData, setQuizData] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [resetQuiz, setResetQuiz] = useState(0);
  const { amountOfQuestions, answerType, category, difficulty } =
    props.formData;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=${amountOfQuestions}&type=${answerType}&category=${category}&difficulty=${difficulty}`
    )
      .then((res) => res.json())
      .then((data) => {
        setQuizData(() => {
          return data.results.map((question) => {
            const incorrect = question.incorrect_answers.map((answer) => {
              return {
                value: answer,
                isHeld: false,
                id: nanoid(),
                isCorrect: false,
                showAnswer: false,
              };
            });

            const correct = {
              value: question.correct_answer,
              id: nanoid(),
              isHeld: false,
              isCorrect: true,
              showAnswer: false,
            };

            let allAnswersArr = [...incorrect];
            let randomNum = Math.floor(Math.random() * 4);
            allAnswersArr.splice(randomNum, 0, correct);

            return { ...question, allAnswers: allAnswersArr, id: nanoid() };
          });
        });
      })
      .finally(() => setIsLoading(false));
  }, [resetQuiz, amountOfQuestions, answerType, difficulty, category]);

  function updateHeld(qID, aID) {
    setQuizData((prevData) => {
      return prevData.map((question) => {
        if (qID !== question.id) {
          return question;
        } else {
          const newAnswers = question.allAnswers.map((answer) =>
            answer.id === aID
              ? {
                  ...answer,
                  isHeld: !answer.isHeld,
                  showAnswer: !answer.showAnswer,
                }
              : { ...answer, isHeld: false, showAnswer: false }
          );

          return { ...question, allAnswers: newAnswers };
        }
      });
    });
  }

  function checkAnswers() {
    setShowAnswers(true);
  }

  let score = 0;

  if (showAnswers) {
    quizData.map((question) => {
      return question.allAnswers.forEach((answer) => {
        return answer.isHeld && answer.isCorrect ? score++ : score;
      });
    });
  }

  console.log(score);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.innerWidth > 600 ? "auto" : "smooth",
    });
  };
  function reset() {
    setShowAnswers(false);
    setResetQuiz((prev) => prev + 1);
    goToTop();
  }

  const buttonElements = {
    render: !showAnswers ? (
      <div className="quiz__footer">
        <button className="btn quiz__btn" onClick={checkAnswers}>
          Check Answers
        </button>
      </div>
    ) : (
      <div className="quiz__footer quiz__footer--finished">
        <p className="quiz__finalText">{`You scored ${score}/${amountOfQuestions} answers`}</p>
        <button className="btn quiz__btn" onClick={reset}>
          Play Again
        </button>
      </div>
    ),
  };
  const questionElements = quizData.map((question, index) => {
    return (
      <Question
        key={nanoid()}
        question={question.question}
        allAnswers={question.allAnswers}
        updateHeld={updateHeld}
        questionIndex={index}
        qID={question.id}
        showAnswers={showAnswers}
        type={question.type}
        v={question.allAnswers[0].showAnswer}
      />
    );
  });

  return (
    <div>
      {isLoading ? (
        <div className="quiz__loadingBox">
          <h3 className="quiz__loadingText">One moment please...</h3>
        </div>
      ) : (
        <div className="quiz__answers">
          <div className="quiz__header">
            <h1>Quizzical</h1>
            <i class="fa-solid fa-house fa-flip" onClick={props.startQuiz}></i>
          </div>
          {questionElements}
          {buttonElements.render}
        </div>
      )}

      <img className="yellowBlob" src={yellowBlob} alt="" />
      <img className="blueBlob" src={blueBlob} alt="" />
    </div>
  );
}

export default Quiz;
