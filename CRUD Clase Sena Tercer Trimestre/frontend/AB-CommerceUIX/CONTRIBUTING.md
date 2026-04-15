# 🛠️ Contributing Guide

¡Gracias por tu interés en contribuir a este proyecto! Este documento describe las reglas y buenas prácticas para colaborar de forma efectiva.

## 📦 Estructura de ramas

- Cada **caso de uso** debe desarrollarse en una **rama independiente**.
  - Formato sugerido: `feature/<nombre-del-caso-de-uso>`
  - Ejemplo: `feature/registro-usuario`
- Las ramas deben crearse a partir de la rama `main`.

## 📝 Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro y automatizar procesos. Los tipos permitidos son:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `chore`: Tareas menores (configuración, mantenimiento, etc.)

Ejemplo de commit válido: "fix: se corrigio el error #### el cual generaba error al iniciar sesión"

## ⏱️ Revisión de Pull Requests

- El tiempo estimado de respuesta para revisar un PR es de **4 horas**.
- Asegúrate de que tu PR incluya:
  - Descripción clara del cambio
  - Referencia al caso de uso (si aplica)
  - Pruebas o evidencia funcional (si corresponde)

## ✅ Checklist antes de hacer PR

- [ ] Código probado localmente
- [ ] Documentación actualizada (si aplica)
- [ ] Sin errores ortográficos ni warnings
- [ ] Cumple con las convenciones de commits
- [ ] Rama actualizada con `main`

## 🧪 Testing

- Si tu contribución incluye lógica, intenta agregar pruebas unitarias o de integración.
- Usa el framework de pruebas definido en el proyecto.

## 💬 Comunicación

- Para dudas, sugerencias o problemas, usa el canal de comunicación definido (WhatsApp).
- Sé respetuoso y claro en tus comentarios.

---

## Code

- Para crear un componente se crea la carpeta dentro de componentes, luego se crear el archivo .jsx (EnPascalCase) y se puede usar los siguientes comandos para crear el componente:
    - rafc: funcion llave
*Nota:* Si vas a agragar componentes dentro de otros componentes, a la hora de crear el componentes, borra el div que se crea por defecto y dejalo vacio <></> o puedes usar <Fragment><Fragment/>

## Extenciones necesarias 

- Simple React Snippets (sugerencias de autocompletado, ademas tiene abrevieturas para hacer atajos mas ràpidos).
- ES7+ React/Redux/React-Native snippets (tiene abrevieturas para hacer atajos mas ràpido)
- ES7 React/Redux/GraphQL/React-Native snippets (tiene abrevieturas para hacer atajos mas ràpido)

## SVGs, IMGS, Fonts

- Para poder poner un icono ESTATICO, font, este debe ser puesto en la carpeta src, assets, y seleccionar lo que desee modificar, poner, etc.
Para usarlos, debe importarlos, danto un nombre de archivo y la ruta correspondiente y usarla de la siguiente forma
<img src={InfoIcon} alt="info" className="w-12" />
- Para iconos inline estos deberán ser ubicados en public en el archivo sprites.svg, en el mismo formato donde se ubica los svg, para usarlos 
<SpriteIcon className="cursor-pointer hover:text-[var(--hover-efect-color)]f" size="25" color= "white" name="user"/>


¡Gracias por ayudar a mejorar este proyecto! 🚀