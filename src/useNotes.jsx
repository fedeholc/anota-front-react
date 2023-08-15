// estos hooks estaban en el NotesContext.jsx pero vite advertía que no podía hacer uso del fast refresh de react porque para poder usar eso no se pueden exportar funciones que no sean de componentes.

import { useContext } from "react";
import { NotesContext } from "./context.jsx";

// se crean hooks para usar el contexto de notas y el dispatch de notas
// esto permite que en vez de usar useContext(NotesContext) y useContext(NotesDispatchContext) se pueda usar useNotes() y useNotesDispatch() en los componentes que las necesiten
// esto es lo que se llama un custom hook
// permite que se pueda insertar lógica en el medio si fuera necesario (por ahora no)

export function useNotes() {
  return useContext(NotesContext);
}
