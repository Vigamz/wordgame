import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const wordList = {
  animals: [
    { en: "Monkey", ru: "Обезьяна" },
    { en: "Mouse", ru: "Мышь" },
    { en: "Panda", ru: "Панда" },
    { en: "Seal", ru: "Тюлень" },
    { en: "Wolf", ru: "Волк" },
    { en: "Yak", ru: "Як" },
    { en: "Lion", ru: "Лев" },
    { en: "Octopus", ru: "Осьминог" },
    { en: "Turtle", ru: "Черепаха" },
    { en: "Goat", ru: "Козлик" },
    { en: "Gorilla", ru: "Горилла" },
    { en: "Alligator", ru: "Аллигатор" },
    { en: "Ant", ru: "Муравей" },
    { en: "Dog", ru: "Собака" },
    { en: "Duck", ru: "Утка" },
    { en: "Elephant", ru: "Слон" },
    { en: "Fish", ru: "Рыба" },
    { en: "Horse", ru: "Лошадь" },
    { en: "Insect", ru: "Насекомое" },
    { en: "Iguana", ru: "Игуана" }
  ],
  food: [
    { en: "Jam", ru: "Варенье" },
    { en: "Juice", ru: "Сок" },
    { en: "Milk", ru: "Молоко" },
    { en: "Peach", ru: "Персик" },
    { en: "Pineapple", ru: "Ананас" },
    { en: "Olive", ru: "Оливка" },
    { en: "Rice", ru: "Рис" },
    { en: "Egg", ru: "Яйцо" }
  ],
  clothes: [
    { en: "Jacket", ru: "Куртка" },
    { en: "Hat", ru: "Шапка" },
    { en: "Socks", ru: "Носки" }
  ],
  furniture: [
    { en: "Pen", ru: "Ручка" },
    { en: "Box", ru: "Коробка" },
    { en: "Watch", ru: "Часы" },
    { en: "Desk", ru: "Парта" },
    { en: "Doll", ru: "Кукла" },
    { en: "Fan", ru: "Вентилятор" },
    { en: "Fork", ru: "Вилка" },
    { en: "Lamp", ru: "Лампа" },
    { en: "Key", ru: "Ключ" },
    { en: "Envelope", ru: "Конверт" }
  ],
  home: [
    { en: "House", ru: "Дом" },
    { en: "Tent", ru: "Палатка" },
    { en: "Farm", ru: "Ферма" },
    { en: "Quilt", ru: "Одеяло" },
    { en: "Gift", ru: "Подарок" }
  ],
  nature: [
    { en: "Leaf", ru: "Лист" },
    { en: "Nest", ru: "Гнездо" },
    { en: "Nut", ru: "Орех" }
  ],
  school: [
    { en: "Teacher", ru: "Учитель" },
    { en: "Quiz", ru: "Тест" },
    { en: "Question", ru: "Вопрос" }
  ],
  other: [
    { en: "Money", ru: "Деньги" },
    { en: "Soap", ru: "Мыло" },
    { en: "Web", ru: "Сеть" },
    { en: "The Sun", ru: "Солнце" },
    { en: "Water", ru: "Вода" },
    { en: "Wax", ru: "Воск" },
    { en: "Net", ru: "Сачок" },
    { en: "King", ru: "Король" },
    { en: "Queen", ru: "Королева" },
    { en: "Jet", ru: "Самолет" },
    { en: "Ax", ru: "Топор" }
  ]
};

const topics = Object.entries({
  animals: "Животные",
  food: "Фрукты / Еда",
  clothes: "Одежда",
  furniture: "Мебель",
  home: "Дом / быт",
  nature: "Природа",
  school: "Учёба",
  other: "Прочее"
});

export default function WordGame() {
  const [topic, setTopic] = useState("animals");
  const [currentWord, setCurrentWord] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewWords, setReviewWords] = useState([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("⚠️ Ваш браузер не поддерживает распознавание речи.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      handleAnswer(spoken);
    };
    recog.onstart = () => setIsAnswering(true);
    recog.onend = () => setIsAnswering(false);
    setRecognition(recog);
  }, []);

  useEffect(() => {
    nextWord();
  }, [topic, reviewMode, reviewWords]);

  function handleAnswer(answer) {
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    };
    const cleanAnswer = answer.trim().toLowerCase();
    const correct = currentWord.en.trim().toLowerCase();
    if (cleanAnswer === correct) {
      setFeedback(`✅ Correct! Правильный ответ: ${currentWord.en}`);
      speak(currentWord.en);
      setTimeout(() => nextWord(), 1500);
    } else {
      setFeedback(`❌ Wrong. Correct answer: ${currentWord.en}`);
      speak(currentWord.en);
      setMistakes((prev) => [...prev, currentWord]);
    }
  }

  function nextWord() {
    const list = reviewMode ? reviewWords : wordList[topic];
    if (!list.length) {
      setFeedback(reviewMode
        ? "🎉 Ты здорово поработал! Теперь ты знаешь больше слов!"
        : "🎉 Все слова пройдены!");
      return;
    }
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(random);
    setFeedback("");
  }

  function startReview() {
    if (mistakes.length === 0) {
      setFeedback("✅ Нет ошибок для повтора! Ты супер! Все ответил правильно!");
      return;
    }
    const listToReview = Array.from(new Set(mistakes.map(JSON.stringify))).map(JSON.parse);
    setReviewWords(listToReview);
    setReviewMode(true);
  }

  return (
    <div className="p-4 max-w-md mx-auto w-full min-h-screen flex flex-col justify-start items-center">
      <div className="mb-4 w-full text-center">
        <select
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setReviewMode(false);
            setMistakes([]);
          }}
          className="border p-2 rounded w-full sm:w-1/2 text-center"
        >
          {topics.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {currentWord && (
        <>
          <p className="text-xl mb-4 text-center">
            <strong>{currentWord.ru}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-center w-full">
            {recognition && (
              <Button
                onClick={() => recognition.start()}
                disabled={isAnswering}
                className="w-full sm:w-auto"
              >
                {isAnswering ? "🎙️ Слушаю..." : "🎤 Произнеси"}
              </Button>
            )}
            <Button onClick={nextWord} className="w-full sm:w-auto">
              ➡️ Далее
            </Button>
            <Button onClick={startReview} className="w-full sm:w-auto" variant="outline">
              🔁 Повторить
            </Button>
          </div>
          {feedback && <p className="mt-4 text-lg text-center w-full">{feedback}</p>}
        </>
      )}
    </div>
  );
}
