import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Detalles del Producto</h1>
      <p>ID del producto: {id}</p>
      {/* Los detalles del producto se cargarán aquí */}
    </div>
  );
}

export default ProductDetails;
