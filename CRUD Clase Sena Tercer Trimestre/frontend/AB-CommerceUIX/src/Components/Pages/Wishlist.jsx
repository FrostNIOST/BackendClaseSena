import { useEffect, useState } from "react";
import { getStoredAuth } from "../../utils/sessionAuth";
import {
  getWishlist,
  removeWishlistItem,
} from "../../controllers/wishlistController";

const roleLabels = {
  admin: "Administrador",
  coordinador: "Coordinador",
  auxiliar: "Auxiliar",
  user: "Usuario",
};

const roleDescriptions = {
  admin: "Puedes consultar, modificar y eliminar elementos de una wishlist.",
  coordinador: "Puedes coordinar procesos y revisar informacion interna.",
  auxiliar: "Puedes operar las tareas de apoyo del sistema.",
  user: "Puedes gestionar tu lista de deseos y realizar compras.",
};

export default function Wishlist() {
  const auth = getStoredAuth();
  const role = auth?.user?.role;
  const allowed = ["admin", "coordinador", "auxiliar", "user"].includes(role);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const loadWishlist = async () => {
    if (!allowed) {
      setLoading(false);
      setWishlist(null);
      return;
    }

    try {
      setLoading(true);
      const response = await getWishlist();
      setWishlist(response?.data || null);
      //console.log("Wishlist cargada:", response.data);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "No fue posible cargar la wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [allowed]);

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");
      await removeWishlistItem(productId);
      await loadWishlist();
    } catch (removeError) {
      setError(removeError.message || "No fue posible quitar el producto");
    } finally {
      setRemovingId("");
    }
  };
  console.log("Wishlist state:", wishlist);

  const products = wishlist?.products || [];

  return (
    <div className="px-12 py-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
          Wishlist - {roleLabels[role] || "Rol desconocido"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {roleDescriptions[role] || "No tienes un rol valido para esta vista."}
        </p>

        {!allowed && <p className="mt-4">No tienes permiso para acceder a esta pagina.</p>}
        {allowed && loading && <p className="mt-4">Cargando wishlist...</p>}
      </div>

      <div className="mt-6">
        {error && <p className="text-red-500">{error}</p>}

        {allowed && !loading && wishlist && (
          <div>
            <h2 className="mb-2 text-xl font-bold">Tu Lista de Deseos</h2>
            <p className="mb-4 text-sm text-gray-600">
              ID de wishlist: {wishlist.wishlistId}
            </p>

            {products.length === 0 ? (
              <p>No tienes productos agregados en la wishlist.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold">{product.nombre}</h3>
                    <p className="text-sm text-gray-600">Precio: ${product.precio}</p>
                    <p
                      className={`text-sm ${
                        product.inStock ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.inStock ? "En stock" : "Sin stock"}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(product.id)}
                      disabled={removingId === product.id}
                      className="mt-3 rounded bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {removingId === product.id
                        ? "Quitando..."
                        : "Quitar de la wishlist"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
