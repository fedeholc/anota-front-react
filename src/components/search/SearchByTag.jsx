import "./SearchByTag.css";
import { Select } from "antd";
import { SetNotesFilterContext } from "../../context";
import { useContext } from "react";
import { useNotes } from "../../NotesContextHooks";

export default function SearchByTag() {
  const {notes} = useNotes();
  const setNotesFilter = useContext(SetNotesFilterContext);

  let uniqueTags = [];
  // array with all notes.tags separated by comma
  if (notes) {
    const allTags = notes.map((note) => note.tags.split(",")).flat();

    // trim tags
    allTags.forEach((tag, index) => {
      allTags[index] = tag.trim();
    });

    // remove duplicated tags
    uniqueTags = [...new Set(allTags)];

    // remove empty tags
    uniqueTags.forEach((tag, index) => {
      if (tag === "") {
        uniqueTags.splice(index, 1);
      }
    });

    // sort tags
    uniqueTags.sort();
  }

  const options = [];

  uniqueTags.forEach((tag) => {
    options.push({
      value: tag,
      label: tag,
    });
  });

  const handleChange = (value) => {
    setNotesFilter((prev) => {
      return { ...prev, tags: value };
    });
  };

  return (
    <div>
      <Select
        mode="multiple"
        allowClear
        style={{
          width: "200px",
        }}
        placeholder="Buscar por tag..."
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}
