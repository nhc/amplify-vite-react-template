import { useUI } from "../../../context/hooks/useUIHook";

export const Drawer = () => {
  const { state, dispatch } = useUI();

  function Open() {
    return (
      <span
        className="cursor-pointer border-2 border-gray-900 dark:border-white rounded-full px-2"
        onClick={() =>
          dispatch({
            type: "SET_FOCUS_ON_RESPONSE",
            payload: { focusOnResponse: true },
          })
        }
      >
        ←
      </span>
    );
  }

  function Close() {
    return (
      <span
        className="cursor-pointer border-2 border-gray-900 dark:border-white rounded-full px-2"
        onClick={() =>
          dispatch({
            type: "SET_FOCUS_ON_RESPONSE",
            payload: { focusOnResponse: false },
          })
        }
      >
        →
      </span>
    );
  }
  return (
    <div className="text-black dark:text-white text-xl mb-3">
      {!state.focusOnResponse ? <Open /> : <Close />}
    </div>
  );
};
