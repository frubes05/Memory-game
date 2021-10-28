import "./App.css";
import { useState, useEffect, useCallback } from "react";
import SingleCard from "./components/SingleCard";

const cardsList = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [turnsVisible,setTurnsVisible]=useState(false);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled,setDisabled]=useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...cardsList, ...cardsList]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurnsVisible(true);
    setTurns(0);
  };

  const resetChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => {
      return prev + 1;
    });
    setDisabled(false);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const evaluateCards = useCallback((card1, card2) => {
    if (card1 && card2) {
      setDisabled(true);
      if (card1.src === card2.src) {
        setCards((prev) => {
          return prev.map((card) => {
            if (card.src === card1.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetChoices();
      } else {
        setTimeout(()=>{
          resetChoices();
        },1000)
      }
    }
  }, []);


  useEffect(() => {
    evaluateCards(choiceOne, choiceTwo);
  }, [choiceOne, choiceTwo]);

  useEffect(()=>{
    shuffleCards();
  },[])

  return (
    <div className="App">
      <h1>Memory Magic</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            handleChoice={handleChoice}
            key={card.id}
            card={card}
            flipped={card===choiceOne || card===choiceTwo || card.matched}
            disabled={disabled}
          ></SingleCard>
        ))}
      </div>
     {turnsVisible && <p>Turn {turns}</p>}
    </div>
  );
}

export default App;
