import { useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const nav = useNavigate();

  return (
    <div>
      <h2>Booking Successful</h2>
      <button onClick={() => nav("/employee/categories")}>Back</button>
    </div>
  );
}
