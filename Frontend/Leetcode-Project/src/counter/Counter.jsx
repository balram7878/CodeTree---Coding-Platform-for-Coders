import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, reset } from "../utils/authSlice";
export default function Counter() {
  const count = useSelector((state) => state.authSlice.count);
  const dispatch = useDispatch();
  return (
    <>
      <h1>{count}</h1>
      <button
        onClick={() => {
          const obj = increment();
          dispatch(obj);
        }}
        className="border border-gray-500 py-1 px-2 rounded-md mr-2"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch(decrement())}
        className="border border-gray-500 py-1 px-2 rounded-md mr-2"
      >
        Decrement
      </button>{" "}
      <button
        onClick={() => dispatch(reset())}
        className="border border-gray-500 py-1 px-2 rounded-md"
      >
        Reset
      </button>
    </>
  );
}
