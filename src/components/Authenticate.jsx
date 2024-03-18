import { useState } from 'react'

import pb from '../pocketbaseClient';

export default function Authenticate() {
  const [symbolIndex, setSymbolindex] = useState(0)

  async function withGoogle() {
    await pb.collection('users').authWithOAuth2({ provider: 'google' });
    
  }
  
  
  return (
    <div className='h-screen w-screen bg-wood text-paper'>
      <button type="button" onClick={withGoogle} className="border">
        asd
      </button>
    </div>
  )
}