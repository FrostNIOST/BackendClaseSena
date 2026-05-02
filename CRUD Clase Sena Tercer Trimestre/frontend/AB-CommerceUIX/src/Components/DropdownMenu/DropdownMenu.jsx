import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DropdownMenu({ trigger, items, className = "" }) {
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
        <ul
          className={`absolute top-full right-0 mt-2 w-52 p-3 bg-white text-black rounded shadow-lg z-10 ${className}`}
        >
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              item={item}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              closeMenu={() => {
                setOpen(false);
                setActiveSubmenu(null);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function MenuItem({ item, activeSubmenu, setActiveSubmenu, closeMenu }) {
  const { label, submenu, to, onClick, disabled, className = "" } = item;
  const isOpen = activeSubmenu === label;
  const hasSubmenu = Array.isArray(submenu) && submenu.length > 0;

  const handleItemClick = () => {
    if (disabled) return;

    if (hasSubmenu) {
      setActiveSubmenu(isOpen ? null : label);
      return;
    }

    onClick?.();
    closeMenu();
  };

  const itemClasses = `w-full text-left px-2 py-1 hover:bg-gray-200 cursor-pointer block rounded ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  return (
    <li className="relative">
      {to && !hasSubmenu && !disabled ? (
        <Link to={to} onClick={closeMenu} className={itemClasses}>
          {label}
        </Link>
      ) : (
        <button onClick={handleItemClick} className={itemClasses}>
          {label}
        </button>
      )}

      {hasSubmenu && isOpen && (
        <ul className="absolute right-full top-0 w-40 p-3 bg-white text-black rounded shadow-lg z-20">
          {submenu.map((sub, idx) => (
            <MenuItem
              key={idx}
              item={typeof sub === "string" ? { label: sub } : sub}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              closeMenu={closeMenu}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

