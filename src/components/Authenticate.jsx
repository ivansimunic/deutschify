import { useState } from 'react'

import pb from '../pocketbaseClient';

export default function Authenticate() {
  const [symbolIndex, setSymbolindex] = useState(0)

  const symbols = [
    "i-ri-beer-fill",
    "i-mdi-pretzel",
    "i-mdi-sausage",
    "i-icon-park-solid-eagle",
    "i-game-icons-iron-cross",
    "i-game-icons-oak-leaf",
  ]
  
  function switchSymbol() {
    setSymbolindex((symbolIndex+1) % 6)
  }
  
  async function withGoogle() {
    await pb.collection('users').authWithOAuth2({ provider: 'google' });
    location.reload()
  }
  
  
  return (
    <div className='flex flex-col items-center justify-between h-screen w-screen bg-wood text-paper'>
      <div className='flex justify-between w-full p-3'>
        <p className='text-lg'>Deutschify</p>
        <button onClick={switchSymbol} className='bg-paper rounded-full h-8 w-8'>
          <span className={symbols[symbolIndex] + " h-8 w-6 bg-wood"} />
        </button>
      </div>
      <div className='flex flex-col items-center'>
        <p className='text-3xl'>Learn German</p>
        <p className='text-3xl'>on-the-go</p>
      </div>
      <div className='flex flex-col items-center text-lg'>
        <p>Add words as you encounter them in life.</p>
        <p>Open the app in chunks of free time.</p>
      </div>
      <p className='text-lg'>The system takes care of the rest</p>
      <button type="button" onClick={withGoogle} className="flex justify-center items-center h-fit bg-paper rounded-full w-fit mb-24 text-wood text-sm">
        <span className="i-mingcute-google-fill pl-9 h-5 w-5 bg-wood" />
        <p className='pt-2 pb-2 pr-4'>Continue with Google</p>
      </button>
    </div>
  )
}