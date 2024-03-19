import { useState, useEffect } from 'react'
import { supermemo } from 'supermemo';
import dayjs from 'dayjs'

import pb from '../pocketbaseClient'

export default function Study({ setFrame }) {
  const [term, setTerm] = useState("")
  const [writable, setWritable] = useState(true)
  const [correct, setCorrect] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [toStudy, setToStudy] = useState(null)
  
  useEffect(() => {
    async function getEm() {
      const f = await pb.collection('flashcards').getFullList({
        sort: 'dueDate'
      })
      setFlashcards(f)
      console.log(f)
    }
    getEm()
    
  }, [])
  
  useEffect(() => {
    console.log('The flashcards have changed')
    
    if (flashcards.length > 0) {
      if (Date.parse(flashcards[0].dueDate) < Date.now()) {
        setToStudy(flashcards[0])
      }
      else
        setToStudy(null)    
    }
  }, [flashcards])
  
  
  
  function check(event) {
    if (event.key === "Enter") {
      setWritable(false)
      setCorrect(term === toStudy.back)
      setTerm(toStudy.back)
      console.log("term: ", term)
      playAudio()
    }
  }
  
  function practice() {
    const { interval, repetition, efactor } = supermemo(toStudy, correct ? 4 : 0);
    console.log("interval", interval, correct)
    const dueDate = dayjs(Date.now()).add(interval, 'day').toISOString();
  
    setTerm("")
    setWritable(true)
    
    console.log(correct, interval, dueDate)
    
    let f = flashcards.map(fc => fc)
    f[0].interval =  interval
    f[0].repetition = repetition
    f[0].efactor = efactor
    f[0].dueDate = dueDate
  
    pb.collection('flashcards').update(f[0].id, f[0]);
    
    f.sort((a, b) => Date.parse(a.dueDate) > Date.parse(b.dueDate) ? 1 : -1)
    setFlashcards(f)
    console.log(flashcards)
  }
  
  function playAudio() {
    const a = new Audio(toStudy.audio)
    a.play()
  }
  
  
  if (!toStudy)
    return (
      <div className='flex flex-col items-center h-full'>
        <p className='mt-[50%] text-3xl'>Nothing to study.</p>
        <button className='mt-10' onClick={() => setFrame("add")}>
          <span className="i-carbon-add-filled h-10 w-10 bg-paper" />
        </button>
      </div>
    )
  
  return (
    <div className='flex flex-col items-center justify-around h-full'>
      <div className='flex flex-col items-center'>
        <p className='text-2xl text-center'>{toStudy.meanings}</p>
        <p className='mt-2 text-center'>{toStudy.type}</p>
      </div>
      <div className='w-8/12 fixed top-[18%]'>
        {!writable ?
        <button onClick={practice} className='bg-paper rounded-full h-9 w-9 flex items-center m-1 absolute right-0'>
          <span className="i-icon-park-outline-right pl-9 h-7 w-7 bg-wood" />
        </button>
        :
        <></>
        }
        <input
          className='bg-paper outline-0 rounded-full text-wood text-center text-xl p-2 w-full'
          type='text' 
          value={term} 
          onKeyDown={check} 
          onChange={({ target }) => setTerm(target.value)}
        />
      </div>
      {
      !writable &&
      <div>
        {
        toStudy.audio &&
        <button className='bg-paper rounded-full h-9 w-9 flex items-center m-6' onClick={playAudio}>
          <span className="i-lets-icons-sound-max-fill ml-px h-8 w-8 bg-wood" />
        </button>
        }
        <div className='flex flex-col items-center h-96 overflow-y-auto'>
          {
          toStudy.examples.map(e => (
            <div className='flex flex-col items-center text-center m-4' key={e.phrase}>
              <p className='text-lg'>{e.phrase}</p>
              <p>{e.translation}</p>
            </div>
            )
          )
          }
        </div>
      </div>
      }
    </div>
  )
}