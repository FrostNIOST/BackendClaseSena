import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../controllers/productController";

function formatPrice(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data || []);
        setError("");
      } catch (loadError) {
        setError(loadError.message || "No fue posible cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="w-full bg-[#f5f1e8] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#101820_0%,#1c3b35_55%,#d4a24c_100%)] px-8 py-14 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            AB-Commerce
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Proximamente banner principal con el catalogo de productos
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
            descripcion del banner principal.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Ir a la tienda
            </Link>
            <Link
              to="/panel"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Panel interno
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Destacados
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Productos disponibles
            </h2>
          </div>
          {!loading && !error ? (
            <p className="text-sm text-gray-500">
              {products.length} producto{products.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
            Cargando productos...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
            No hay productos registrados por ahora.
          </div>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const image = Array.isArray(product.images) ? product.images[0] : null;

              return (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-52 items-center justify-center bg-[linear-gradient(135deg,#ece6da_0%,#d7dde8_100%)] px-6 text-center">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                          Producto
                        </p>
                        <p className="mt-3 text-lg font-semibold text-gray-700">
                          {product.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      {product.category?.name || "Sin categoria"}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-3 min-h-12 text-sm text-gray-600">
                      {product.description || "Este producto no tiene descripcion."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock ?? 0}
                        </p>
                      </div>

                      <Link
                        to={`/product/${product._id}`}
                        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Index;
