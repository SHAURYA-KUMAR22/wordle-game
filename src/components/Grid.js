import React from 'react'
import Row from './Row'

export default function Grid({currentGuess, guesses, turn}) {
  return (
    <div>
      {guesses.map((g, i) => {
        //only want to pass currentGuesses for new row or which we are writing
        if(turn === i) {
            return <Row key={i} currentGuess={currentGuess} />
        }
        return <Row key={i} guess={g} />
      })}
    </div>
  )
}
