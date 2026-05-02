import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createCategory,
  getCategories,
} from "../../controllers/categoryController";
import CategoryModel from "../../models/Category";

export default function Categorylist() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(() => new CategoryModel());

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data || []);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "No fue posible cargar las categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setFormData(new CategoryModel());
      setSuccessMessage("Categoria creada correctamente.");
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || "No fue posible crear la categoria");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          Catalogo
        </p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Categorias</h1>
        <p className="mt-3 text-gray-600">
          Consulta las categorias disponibles consumiendo el controlador del
          backend.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(320px,380px)_1fr]">
        <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            Nueva categoria
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900">
            Crear categoria
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm outline-none focus:border-gray-500"
                placeholder="Ejemplo: Tecnologia"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripcion
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm outline-none focus:border-gray-500"
                placeholder="Describe brevemente la categoria"
              />
            </div>

            {successMessage ? (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full justify-center rounded-full bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Crear categoria"}
            </button>
          </form>
        </aside>

        <div>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              Cargando categorias...
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && categories.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
              No hay categorias registradas por ahora.
            </div>
          ) : null}

          {!loading && !error && categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {categories.map((category) => (
                <article
                  key={category._id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    Categoria
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                    {category.name}
                  </h2>
                  <p className="mt-3 min-h-12 text-gray-600">
                    {category.description || "Esta categoria no tiene descripcion."}
                  </p>
                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/categories/${category._id}`}
                      className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Ver detalle
                    </Link>
                    <Link
                      to={`/categories/${category._id}`}
                      className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Editar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
