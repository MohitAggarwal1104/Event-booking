export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">

      <h1 className="text-xl font-bold text-black">
        EventBook 🚀
      </h1>

      <div className="flex gap-4 items-center">

        <a href="/dashboard" className="hover:text-blue-500">
          Dashboard
        </a>

        <a href="/create" className="hover:text-blue-500">
          Create
        </a>

        <a href="/bookings" className="hover:text-blue-500">
          My Bookings
        </a>

        <a href="/scanner" className="hover:text-blue-500">
          Scan
        </a>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}