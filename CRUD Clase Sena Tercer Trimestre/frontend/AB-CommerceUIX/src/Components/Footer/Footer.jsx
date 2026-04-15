import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-[--background-black] text-white p-8" >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Sobre Nosotros</h3>
            <p className="text-sm text-gray-400">AB-Commerce es tu tienda en línea de confianza.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Categorías</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Smartphones</a></li>
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Laptops</a></li>
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Accesorios</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Ayuda</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Contacto</a></li>
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">FAQ</a></li>
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Soporte</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Términos</a></li>
              <li><a href="#" className="hover:text-[var(--hover-efect-color)]">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 AB-Commerce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
