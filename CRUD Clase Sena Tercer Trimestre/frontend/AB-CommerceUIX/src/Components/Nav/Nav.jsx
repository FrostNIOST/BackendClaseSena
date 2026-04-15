//import InfoIcon from "../../assets/icons/svgrepo-Solar Bold Duotone Icons Collection/info-circle-svgrepo-com.svg";
import logo from "../../assets/img/logo de ecommerce ab png recortada.png";
import SpriteIcon from "../Sprites/SpriteIcon";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
//import { useState } from "react";
import React from "react";

function Nav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [open, setOpen] = React.useState(false);

  const categories = [
    ["📱", "Smartphones"],
    ["💻", "Laptops"],
    ["🎧", "Accesorios"],
    ["🖱️", "Perifericos"],
    ["🔥", "Ofertas"],
  ];
  return (
    <nav className="w-full flex flex-col justify-center items-center">
      {/*Top bar*/}
      <div
        className="w-full flex justify-between items-center p-3  bg-[--background-black] text-white"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        <div className="flex w-1/2 gap-5 items-center ml-24">
          <a
            href="#id"
            className="inline-flex cursor-pointer items-center align-middle"
          >
            <img className="w-10 mr-3" src={logo} alt="logo" />
            <div className="font-bold text-xl ">AB-Commerce</div>
          </a>
        </div>

        <div className="flex relative w-1/2  items-center -ml-40 py-[1.5%] -mr-32">
          <select className="bg-gray-300 p-2 w-40 border-none rounded-lg rounded-r-none outline-none text-black py-[1.8%] text-xs">
            <option>Todas las categorias</option>
            <option>Smartphones</option>
            <option>Laptops</option>
            <option>Accesorios</option>
            <option>Perifericos</option>
          </select>

          <div className="flex items-center w-full relative">
            <input
              className="w-full text-black rounded-lg pl-2 pr-10 border-none outline-none py-[1.5%] rounded-l-none"
              type="text"
              placeholder="Buscar..."
            />
            <button className="absolute right-2 text-gray-500 flex items-center">
              <SpriteIcon
                className="cursor-pointer"
                size="20"
                color="black"
                name="search-copilot"
              />
            </button>
          </div>
        </div>

        <div className="flex w-1/2 justify-end gap-5 items-center mr-24">
          <button href="#id" className="hover:text-[var(--hover-efect-color)]">
            <SpriteIcon
              className="cursor-pointer"
              size="29"
              color="white"
              name="info-circle-svgrepo-com"
            />
          </button>

          <button href="#id" className="hover:text-[var(--hover-efect-color)]">
            <SpriteIcon
              className="cursor-pointer"
              size="25"
              color="white"
              name="heart-water-svgrepo-com"
            />
          </button>

          <button href="#id" className="hover:text-[var(--hover-efect-color)]">
            <SpriteIcon
              className="cursor-pointer"
              size="27"
              color="white"
              name="cart-large-2-svgrepo-com"
            />
          </button>

          <DropdownMenu
            trigger={
              <button className="inline-flex items-center align-middle cursor-pointer hover:text-[var(--hover-efect-color)]">
                <SpriteIcon
                  className="-m-1 -p-1"
                  size="27"
                  color="white"
                  name="global-svgrepo-com"
                />
                <span className="text-xs leading-none align-middle">▼</span>
              </button>
            }
            items={[
              { label: "Idioma", submenu: ["Español", "English"] },
              { label: "Divisa", submenu: ["COP", "USD", "EUR"] },
            ]}
          />

          <DropdownMenu
            trigger={
              <button className="inline-flex items-center align-middle cursor-pointer hover:text-[var(--hover-efect-color)]">
                <SpriteIcon
                  className="-m-1 -p-1"
                  size="27"
                  color="white"
                  name="user-svgrepo-com"
                />
              </button>
            }
            items={[{ label: "Iniciar sesión" }, { label: "Crear cuenta" }]}
          />
        </div>
      </div>

      <div
        className="w-full flex justify-between items-center px-3 pb-3  bg-[--background-black] text-white"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        <div className="flex w-1/2 gap-5 items-center ml-24">
          <div
            className={`w-1/3 px-[1%] lg:px-[1%] py-1 flex justify-between items-center gap-5 transition-all duration-500 ${menuOpen ? "h-auto  backdrop-blur-md shadow-lg rounded-lg" : ""}`}
          >
            <div className="relative w-1/5 ">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center align-middle cursor-pointer hover:text-[var(--hover-efect-color)]">
                    <span className="mr-4">
                      <SpriteIcon
                        className="hover:text-[var(--hover-efect-color)] right-0"
                        size="25"
                        color="white"
                        name="menu-1-svgrepo-com"
                      />
                    </span>
                    Menú
                  </button>
                </div>
                {open && (
                  <ul className="absolute top-full left-0 mt-2 w-48 bg-white text-black rounded-md overflow-hidden shadow-lg z-10 transition-all duration-300">
                    {categories.map(([icon, label], i) => (
                      <a
                        href="#"
                        key={i}
                        className="flex items-center gap-3 px-2 py-2 border-b hover:bg-gray-200 last:border-none"
                      >
                        <span>{icon}</span>
                        <span>{label}</span>
                      </a>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 justify-end gap-5 items-center mr-24">
          <button className="inline-flex items-center align-middle cursor-pointer hover:text-[var(--hover-efect-color)]">
            Filtrar
            <span className="ml-4">
              <SpriteIcon
                className="cursor-pointer hover:text-[var(--hover-efect-color)]"
                size="25"
                color="white"
                name="sort-from-bottom-to-top-svgrepo-com"
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
