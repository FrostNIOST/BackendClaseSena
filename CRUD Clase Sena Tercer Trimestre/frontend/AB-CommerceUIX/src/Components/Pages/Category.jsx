import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteCategory,
  getCategoriesById,
  updateCategory,
} from "../../controllers/categoryController";
import CategoryModel from "../../models/Category";

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(() => new CategoryModel());

  const loadCategory = async () => {
    try {
      const data = await getCategoriesById(id);
      const currentCategory = data.data || data.category || null;
      setCategory(currentCategory);
      setFormData(new CategoryModel(currentCategory || {}));
      setError("");
    } catch (loadError) {
      setError(loadError.message || "No fue posible cargar la categoria");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCategory();
    } else {
      setError("No se encontro el identificador de la categoria");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { id: field, value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await updateCategory(id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      const updatedCategory = data.data || data.category || { ...formData, _id: id };
      setCategory(updatedCategory);
      setFormData(new CategoryModel(updatedCategory));
      setSuccessMessage("Categoria actualizada correctamente.");
      setEditing(false);
    } catch (saveError) {
      setError(saveError.message || "No fue posible actualizar la categoria");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta categoria?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteCategory(id);
      navigate("/categories");
    } catch (deleteError) {
      setError(deleteError.message || "No fue posible eliminar la categoria");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          Cargando categoria...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
          {error}
        </div>
        <Link
          to="/categories"
          className="inline-flex mt-6 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Volver a categorias
        </Link>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600">
          La categoria no existe o no fue encontrada.
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-wrap gap-3">
        <Link
          to="/categories"
          className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Volver
        </Link>
        <button
          type="button"
          onClick={() => {
            setEditing((prev) => !prev);
            setSuccessMessage("");
            setFormData(new CategoryModel(category));
          }}
          className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {editing ? "Cancelar edicion" : "Editar"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      <article className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
          Detalle
        </p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          {category.name}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {category.description || "Esta categoria no tiene descripcion."}
        </p>

        <div className="mt-8 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
          ID: {category._id}
        </div>

        {successMessage ? (
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {editing ? (
          <form onSubmit={handleUpdate} className="mt-8 space-y-4">
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
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>
          </form>
        ) : null}
      </article>
    </section>
  );
}
