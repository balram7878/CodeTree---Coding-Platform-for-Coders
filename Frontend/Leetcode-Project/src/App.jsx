import { Routes, Route,  Navigate } from "react-router";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Homepage from "./component/Homepage";
import { authUser } from "./utils/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  useEffect(() => {
    dispatch(authUser());
  }, []);

  return (
    <>
      
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Homepage /> : <Navigate to="/login" />
              }
            ></Route>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            ></Route>
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
            ></Route>
          </Routes>
       
   
    </>
  );
}

export default App;
