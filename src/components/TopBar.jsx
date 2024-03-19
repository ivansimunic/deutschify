import Menu from "./Menu"

export default function TopBar({ frame, setFrame }) {
  return (
    <div>
      <div className='flex justify-between w-full p-3 absolute'>
        <p className='text-lg'>Deutschify</p>
        <Menu frame={frame} setFrame={setFrame} />
      </div>
      <div className="h-12">
        
      </div>
    </div>
  )
}