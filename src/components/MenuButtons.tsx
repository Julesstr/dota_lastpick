interface Props {
  setMenuScreen: (item: number) => void;
}

const MenuButtons = ({ setMenuScreen }: Props) => {
  return (
    <div
      className="btn-group-vertical"
      role="group"
      aria-label="Vertical button group"
    >
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => setMenuScreen(0)}
      >
        Play
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => setMenuScreen(1)}
      >
        Disclaimer
      </button>
    </div>
  );
};

export default MenuButtons;
