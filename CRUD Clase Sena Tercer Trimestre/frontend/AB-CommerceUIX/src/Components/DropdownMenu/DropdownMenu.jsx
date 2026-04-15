// DropdownMenu.jsx
import { useState, useRef, useEffect } from "react";

export default function DropdownMenu({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <ul className="absolute top-full right-0 mt-2 w-40 p-3 bg-white text-black rounded shadow-lg z-10">
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              label={item.label}
              submenu={item.submenu}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function MenuItem({ label, submenu, activeSubmenu, setActiveSubmenu }) {
  const isOpen = activeSubmenu === label;

  return (
    <li className="relative">
      <button
        onClick={() => setActiveSubmenu(isOpen ? null : label)}
        className="w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer block"
      >
        {label}
      </button>

      {submenu && isOpen && (
        <ul className="absolute right-full top-0 w-40 p-3 bg-white text-black rounded shadow-lg z-20">
          {submenu.map((sub, idx) => (
            <li key={idx} className="w-full px-2 py-1 hover:bg-gray-200 cursor-pointer block">
              {sub}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}


