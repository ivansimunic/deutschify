import { useState } from 'react'

import TopBar from './components/TopBar'
import Settings from './components/Settings'
import Study from './components/Study'
import Add from './components/Add'

export default function App() {
  const [frame, setFrame] = useState("study")//add, study, settings
  const [user, setUser] = useState(null)
  
  
  if (!user)
    return (
      <div className='h-screen w-screen bg-wood text-paper'>
        auth
      </div>
    )
  
  if (frame === "add")
    return (
      <div className='h-screen w-screen bg-wood text-paper'>
        <TopBar frame={frame} setFrame={setFrame} />
        <Add />
      </div>
    )
    
  if (frame === "study")
    return (
      <div className='h-screen w-screen bg-wood text-paper'>
        <TopBar frame={frame} setFrame={setFrame} />
        <Study />
      </div>
    )
    
  if (frame === "settings")
    return (    
      <div className='h-screen w-screen bg-wood text-paper'>
        <TopBar frame={frame} setFrame={setFrame} />
        <Settings />
      </div>
    )
  

}