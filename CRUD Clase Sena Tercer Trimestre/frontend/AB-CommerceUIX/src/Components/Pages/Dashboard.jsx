import { Link } from "react-router-dom";
import { getStoredAuth } from "../../utils/sessionAuth";
import SpriteIcon from "../Sprites/SpriteIcon";

const privilegedRoles = ["admin", "coordinador", "auxiliar"];

const roleLabels = {
  admin: "Administrador",
  coordinador: "Coordinador",
  auxiliar: "Auxiliar",
  user: "Usuario",
};

const roleDescriptions = {
  admin: "Tienes acceso completo a las herramientas internas.",
  coordinador: "Puedes coordinar procesos y revisar informacion interna.",
  auxiliar: "Puedes operar las tareas de apoyo del sistema.",
};

export default function Dashboard() {
  const auth = getStoredAuth();
  const role = auth?.user?.role;
  const allowed = ["admin", "coordinador", "auxiliar"].includes(role);

  if (!allowed) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Panel interno</h1>
        <p className="mt-4 text-gray-600">
          Este espacio solo esta disponible para admin, coordinador o auxiliar.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
        Panel interno
      </p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900">
        Bienvenido, {auth.user.username}
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Rol actual: <strong className="text-gray-900">{role}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        {roleDescriptions[role] || "Tu cuenta tiene permisos internos."}
      </p>
      {/* Aqui va el menu del dashboard (gestion de usuarios, categorias, subcategorias, productos)*/}
      <div className="w-full gap-10 grid auto-cols-max grid-flow-col min-h-[200px] mt-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-middle">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-items-center">
          
          <SpriteIcon
                className="cursor-pointer"
                size="50"
                color="black"
                name="users-group-two-rounded-svgrepo-com"
              />
          Gestion de Usuarios

        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-items-center">
          <Link to="/categories" className="flex flex-col items-center">
          <SpriteIcon
                className="cursor-pointer"
                size="50"
                color="black"
                name="pen-new-square-svgrepo-com"
              />
          Gestion de Categorias
          </Link>
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-items-center">
          <SpriteIcon
                className="cursor-pointer"
                size="50"
                color="black"
                name="pen-new-square-svgrepo-com"
              />
          Gestion de Subcategorias
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-items-center">
          <SpriteIcon
                className="cursor-pointer"
                size="50"
                color="black"
                name="pen-new-square-svgrepo-com"
              />
          Gestion de Productos
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-items-center">
          <SpriteIcon
                className="cursor-pointer"
                size="50"
                color="black"
                name="heart-water-svgrepo-com"
              />          
          Gestion de Wishlist
        </button>
      </div>
    </section>
  );
}
