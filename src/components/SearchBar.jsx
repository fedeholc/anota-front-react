import { NotesFilterContext, SetNotesFilterContext } from "../NotesContext";
import { useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchBar() {
  const notesFilter = useContext(NotesFilterContext);
  const setNotesFilter = useContext(SetNotesFilterContext);

  function handleChange(e) {
    setNotesFilter(e.target.value);
  }

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: "0.5rem"}}>
      <input type="text" placeholder="Buscar..." onChange={handleChange} />
      <SearchOutlined />
    </div>
  );
}
