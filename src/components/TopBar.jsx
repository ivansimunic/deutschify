import Menu from "./Menu"

export default function TopBar({ frame, setFrame }) {
  return (
    <div className="flex justify-between">
      <p>Liguify</p>
      <Menu frame={frame} setFrame={setFrame} />
    </div>
  )
}