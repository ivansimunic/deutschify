import Menu from "./Menu";

export default function TopBar({ frame, setFrame }) {
  return (
    <div>
      <div className="absolute flex w-full justify-between p-3">
        <p className="text-lg">Deutschify</p>
        <Menu frame={frame} setFrame={setFrame} />
      </div>
      <div className="h-12"></div>
    </div>
  );
}
