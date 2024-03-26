import { useState } from 'react'
import axios from 'axios'
import pb from '../pocketbaseClient'
import dayjs from 'dayjs'
import { createEmptyCard } from 'ts-fsrs'


export default function Add() {
  const [term, setTerm] = useState("")
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(0)
  const [uploadStatusIcon, setUploadStatusIcon] = useState("i-mingcute-search-line")
  
  async function getData() {
    setUploadStatusIcon("i-line-md-loading-loop")
    const reza = await axios.get(`https://backend.deutschify.life/linguee/${term}`)
    setOptions(reza.data.words.filter(w => w.audio[0] && w.audio[0].audios[0].version === "German"))
    setUploadStatusIcon("i-octicon-upload-16")
    setTerm(options[selected].term)
  }
  
  function incrementOption() {
    setUploadStatusIcon("i-octicon-upload-16")
    setSelected((selected+1) % options.length)
    setTerm(options[selected].term)
  }
  
  function decrementOption() {
    setUploadStatusIcon("i-octicon-upload-16")
    if (selected === 0)
      setSelected(options.length-1)
    else
      setSelected(selected-1)
    
    setTerm(options[selected].term)
  }
  
  function playAudio() {
    const a = new Audio(options[selected].audio[0].audios[0].url)
    a.play()
  }

  async function upload() {
    setUploadStatusIcon("i-line-md-loading-loop")
    const data = {
      "back": options[selected].term,
      "type": options[selected].type,
      "meanings": options[selected].translations.map(t => t.term).join(", "),
      "audio": options[0].audio[0].audios[0].url,
      "examples": JSON.stringify(options[selected].translations.map(t => t.examples).flat(Infinity)),
      "dueDate": dayjs(Date.now()).toISOString(),
      "user": pb.authStore.model.id,
      "srsData": createEmptyCard(),
    }
    
    await pb.collection('flashcards').create(data)
    setUploadStatusIcon("i-iconamoon-check")
  }
  
  return (
    <div className='flex flex-col items-center justify-around h-full'>
      <div className='w-8/12 fixed top-[18%]'>
        {options[selected] !== null ?
        <button onClick={upload} className='bg-paper rounded-full h-9 w-9 flex items-center m-1 absolute left-0'>
          <span className={`${uploadStatusIcon} pl-9 h-7 w-7 bg-wood`} />
        </button>
        :
        <></>
        }
        <input
          placeholder='German word to add...'
          className='bg-paper outline-0 rounded-full text-wood text-center text-xl p-2 w-full'
          type='text' 
          value={term} 
          onKeyDown={({ key }) => { if (key === "Enter") getData() }} 
          onChange={({ target }) => setTerm(target.value)}
        />
      </div>
      {
      options.length > 0 ?
      <div className='flex flex-col items-center fixed top-[33%]'>
        <hr className='w-10/12 rounded-full bg-paper border-1' />
        <div className='flex justify-between w-full m-4'>
          <button onClick={decrementOption}>
            <span className="i-icon-park-outline-left pl-9 h-8 w-8 bg-paper ml-4" />
          </button>
          <div className='flex flex-col items-center'>
            <p className='text-2xl text-center'>{options[selected].translations.map(t => t.term).join(", ")}</p>
            <p className='mt-4 text-center'>{options[selected].type}</p>
          </div>
          <button onClick={incrementOption}>
            <span className="i-icon-park-outline-right pl-9 h-8 w-8 bg-paper mr-4" />
          </button>
        </div>
        <hr className='w-10/12 rounded-full bg-paper border-1' />
        {
        options[selected].audio[0] &&
        <button className='bg-paper rounded-full h-9 w-9 flex items-center m-6' onClick={playAudio}>
          <span className="i-lets-icons-sound-max-fill ml-px h-8 w-8 bg-wood" />
        </button>
        }
        <div className='flex flex-col items-center h-96 overflow-y-auto'>
          {
          options[selected].translations.map(t => t.examples).flat(Infinity).map(e => (
            <div className='flex flex-col items-center text-center m-4' key={e.phrase}>
              <p className='text-lg'>{e.phrase}</p>
              <p>{e.translation}</p>
            </div>
            )
          )
          }
        </div>
      </div>
      :
      <></>
      }
    </div>
  )
  
}