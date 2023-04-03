import { useState } from "react";

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState(""); //what user is typing
  const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
  const [history, setHistory] = useState([]); // each guess is a string // to check use dont submit duplicate gusses
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({}); //{a: 'green', b: 'yellow', c:'grey}, all the keys we have encountered so far and what color they hold

  //format a guess into array of 5 letter objects
  //[{key='a', color:'red'}]
  const formatGuess = () => {
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: "grey" };
    });

    //find any letter at right pos - green
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null; //putting it null so that it same letter wont match again, we dont want to make it yellow again in next word if its pos is wrong
      }
    });

    //find any yellow colors tht is present but not in correct pos
    //piped, match plans
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });

    return formattedGuess;
  };

  //add a new guess to gusses state
  //update isCorrect state is correct guess
  //add 1 to turn state
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true);
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setTurn((prevTurn) => {
      return prevTurn + 1;
    });
    setUsedKeys((prevUsedKeys) => {
      let newKeys = { ...prevUsedKeys };

      formattedGuess.forEach((l) => {
        const currentColor = newKeys[l.key];

        if (l.color === "green") {
          newKeys[l.key] = "green";
          return;
        }
        if (l.color == "yellow" && currentColor !== "green") {
          newKeys[l.key] = "yellow";
          return;
        }
        if (
          l.color === "grey" &&
          currentColor !== "green" &&
          currentColor !== "yellow"
        ) {
          newKeys[l.key] = "grey";
          return;
        }
      });
      return newKeys
    });

    setCurrentGuess("");
  };

  //handle keyup event & track current guess
  //if user presses enter, add the ew guess
  const handleKeyup = ({ key }) => {
    if (key === "Enter") {
      //only add guess if turn is less than 5
      if (turn > 5) {
        console.log("no more turns left");
        return;
      }
      //do not allow duplicte word
      if (history.includes(currentGuess)) {
        console.log("already tried that word");
        setCurrentGuess("");
        return;
      }
      //word should be 5 len
      if (currentGuess.length !== 5) {
        console.log("word must be 5 char long");
        return;
      }
      //no need to pass currentGuess in func as already stored in state
      const formatted = formatGuess();
      addNewGuess(formatted);
    }

    if (key === "Backspace") {
      setCurrentGuess((prev) => {
        return prev.slice(0, -1); //remove the last character
      });
      return;
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return prev + key;
        });
      }
    }
  };

  return { turn, currentGuess, guesses, isCorrect, handleKeyup, usedKeys };
};

export default useWordle;
