import React, { useEffect, useState } from 'react'

export default function Keypad({usedKeys}) {
    const [letters, setLetters] = useState(null)

    useEffect(() => {
        fetch('http://localhost:30001/letters')
        .then(res => res.json()) 
        .then(json => { //this json is array of objects
            setLetters(json)
        })
    }, [])

  return (
    <div className="keypad">
      {letters && letters.map((l) => {
        const color = usedKeys[l.key] //when undefined then classname wont get added and it wont style it
        return (
            <div key={l.key} className={color}> {l.key} </div>
        )
      })}
    </div>
  )
}
