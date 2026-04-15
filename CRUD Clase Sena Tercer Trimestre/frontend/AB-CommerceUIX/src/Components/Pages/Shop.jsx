import React from 'react';

function Shop() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Tienda</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Los productos se cargarán aquí */}
        <p>Cargando productos...</p>
      </div>
    </div>
  );
}

export default Shop;
