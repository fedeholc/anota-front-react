import { SetNotesFilterContext } from "../NotesContext";
import { useContext } from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./SearchBar.css";
import { Input  } from "antd";


export default function SearchBar() {
  const { Search } = Input;

  const setNotesFilter = useContext(SetNotesFilterContext);

  //TODO: falta icono y funcion de clear search

  function handleChange(e) {
    setNotesFilter(prev => {
      return ({...prev,
      text: e.target.value});
    });
  }

  return (
    <div
    
    >
    {/*   <input
        className="search__input"
        type="text"
        placeholder="Buscar..."
        onChange={handleChange}
      /> */}
{/*       <SearchOutlined className="search__icon" />
 */}      <Search
        placeholder="Buscar..."
        allowClear
        onChange={handleChange}
        style={{
          width: 200,
        }}
      />
    </div>
  );
}
