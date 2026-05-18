export default function Toast({ message, type }) {
  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 
      px-4 py-2 rounded shadow 
      ${type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
      {message}
    </div>
  );
}