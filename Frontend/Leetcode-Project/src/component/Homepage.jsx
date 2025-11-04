import { useSelector } from "react-redux";

export default function Homepage() {
  const { firstName } = useSelector((state) => state?.auth?.user);
  const userImage =
    "https://menshaircuts.com/wp-content/uploads/2019/04/red-hair-men-full-beard.jpg";

  function showMenu() {
    console.log("menu function");
    return (
      <>
        <ul className="menu bg-base-200 w-56">
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </>
    );
  }

  return (
    <header className="bg-gray-900 h-20 shadow-md sticky top-0 z-10">
      <div className="max-w-full h-full px-10  flex justify-between items-center ">
        <div className="flex items-center">
          <a
            href="/"
            className="text-3xl font-extrabold text-gray-400 tracking-wider"
          >
            CodeTree
          </a>
        </div>

        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => showMenu()}
        >
          <span className="text-lg font-bold text-gray-200 hidden sm:block">
            {firstName || "Guest User"}
          </span>

          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-2 ring-offset-2">
              <img src={userImage} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
