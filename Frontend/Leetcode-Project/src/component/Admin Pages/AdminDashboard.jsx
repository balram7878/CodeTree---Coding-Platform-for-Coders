import { useNavigate } from "react-router";

const PlusCircle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);
const Trash2 = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const Eye = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const RefreshCw = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v6h6" />
    <path d="M21 22v-6h-6" />
    <path d="M21 16a9 9 0 0 0-9-9c-1.8 0-3.5.5-4.9 1.4" />
    <path d="M3 8a9 9 0 0 1 9 9c1.8 0 3.5-.5 4.9-1.4" />
  </svg>
);

const AdminCard = ({ title, description, icon: Icon, color, onClick }) => {
  const baseClasses =
    "flex flex-col items-start p-6 rounded-xl shadow-2xl transition duration-300 transform cursor-pointer";
  const hoverClasses = `hover:ring-4 ${color.ring} hover:scale-[1.03]`;

  return (
    <div
      className={`${baseClasses} ${hoverClasses} bg-gray-800 border-t-4 ${color.border}`}
      onClick={onClick}
    >
      <div className={`p-3 rounded-full ${color.bgLight} mb-4`}>
        <Icon className={`w-8 h-8 ${color.text}`} />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>

      <div
        className={`mt-4 text-sm font-semibold ${color.text} hover:${color.textHover}`}
      >
        Go to tool &rarr;
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create New Problem",
      description:
        "Define a new coding challenge, set difficulty, and add sample test cases.",
      icon: PlusCircle,
      color: {
        bgLight: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500",
        ring: "ring-green-500/30",
      },
      action: () => {
        navigate("/admin/create-problem");
      },
    },
    {
      title: "Update Problem Details",
      description: "Modify existing problem statements, tags, or test data.",
      icon: RefreshCw,
      color: {
        bgLight: "bg-indigo-500/10",
        text: "text-indigo-400",
        border: "border-indigo-500",
        ring: "ring-indigo-500/30",
      },
      action: () => {
        navigate("/admin/update-problem");
      },
    },
    {
      title: "Show All Problems",
      description:
        "View the complete list of problems, including status and details.",
      icon: Eye,
      color: {
        bgLight: "bg-sky-500/10",
        text: "text-sky-400",
        border: "border-sky-500",
        ring: "ring-sky-500/30",
      },
      action: () => {
        navigate("/admin/show-all-problems");
      },
    },
    {
      title: "Delete A Problem",
      description:
        "Permanently remove a problem from the database (Use with caution).",
      icon: Trash2,
      color: {
        bgLight: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500",
        ring: "ring-red-500/30",
      },
      action: () => {
        navigate("/admin/delete-problem");
      },
    },
  ];

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-extrabold text-white mb-10 border-b border-gray-700 pb-3">
        Admin Control Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {cards.map((card) => (
          <AdminCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            color={card.color}
            onClick={card.action}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
