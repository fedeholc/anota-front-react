import { SetNotesFilterContext } from "../NotesContext";
import { useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./SearchBar.css";

export default function SearchBar() {
  const setNotesFilter = useContext(SetNotesFilterContext);

  //TODO: falta icono y funcion de clear search

  function handleChange(e) {
    setNotesFilter(e.target.value);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <input
        className="search__input"
        type="text"
        placeholder="Buscar..."
        onChange={handleChange}
      />
      <SearchOutlined className="search__icon" />
    </div>
  );
}
