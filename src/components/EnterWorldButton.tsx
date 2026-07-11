interface EnterWorldButtonProps {
  onClick: () => void;
}

export function EnterWorldButton({ onClick }: EnterWorldButtonProps) {
  return (
    <button className="enter-button" onClick={onClick} type="button">
      Enter world
    </button>
  );
}
