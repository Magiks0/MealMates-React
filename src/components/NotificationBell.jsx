import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import ProductService from "../services/ProductService";
import { useNavigate } from "react-router";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const fetch = () => ProductService.getNotifications().then(setItems);
    fetch();
    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
  }, [open]);

  const unread = items.filter((n) => !n.isRead && n.type === "expiry");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unread.length > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 bg-red-600 text-white
                           rounded-full text-[10px] w-4 h-4 grid place-items-center"
          >
            {unread.length}
          </span>
        )}
      </button>

      {open && unread.length > 0 && (
        <ul className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-30 rounded-lg py-2">
          {unread.map((n) => (
            <li
              key={n.id}
              className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
              onMouseDown={async () => {
                await ProductService.markNotificationRead(n.id);
                navigate(`/products/${n.targetId}/edit`);
              }}
            >
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
