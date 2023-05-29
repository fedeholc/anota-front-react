import { NotesFilterContext, SetNotesFilterContext } from "../NotesContext";
import { useContext } from "react";
export default function SearchBar() {
   
  const notesFilter = useContext(NotesFilterContext);
    const setNotesFilter = useContext(SetNotesFilterContext);

  function handleChange(e) {
    setNotesFilter(e.target.value);
  }

  return (
    <div>
      <div>SearchBar</div>
      <input type="text" onChange={handleChange}/>
    </div>
  );
}
