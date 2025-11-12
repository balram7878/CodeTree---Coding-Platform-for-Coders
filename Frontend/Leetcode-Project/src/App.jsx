import { Routes, Route, Navigate } from "react-router";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Homepage from "./component/Homepage";
import AdminPage from "./component/AdminPage";
import AdminDashboard from "./component/Admin Pages/AdminDashboard";
import DeleteProblemPage from "./component/Admin Pages/DeleteProblemPage";
import ShowAllProblemsPage from "./component/Admin Pages/ShowAllProblemsPage";
import UpdateProblemPage from "./component/Admin Pages/UpdateProblemPage";
import CreateProblemPage from "./component/Admin Pages/CreateProblemPage";
import { authUser } from "./utils/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state?.auth
  );

  // console.log(user);

  useEffect(() => {
    dispatch(authUser());
    console.log("fetchUser");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="create-problem" element={<CreateProblemPage />} />
          <Route path="delete-problem" element={<DeleteProblemPage />} />
          <Route path="update-problem" element={<UpdateProblemPage />} />
          <Route path="show-all-problems" element={<ShowAllProblemsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
