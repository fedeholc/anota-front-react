/*  create react functional component for managing tags
 receives a string with the tags separated by commas
 display the tags as buttons that can be removed
 it also has an input field to add new tags
 it also recives a function to update the tags in the note
*/

// TODO: pasar estilos a clases

//TODO: revisar que acá además de agregar tags lo hacen para que se pueda modificar una https://ant.design/components/tag

import React, { useState, useRef, useEffect } from "react";
import { Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Tags.css";
import PropTypes from "prop-types";

//add prop types to the function
Tags.propTypes = {
  noteTags: PropTypes.string,
  handleTags: PropTypes.func,
};

export default function Tags({ noteTags, handleTags }) {
  const [inputVisible, setInputVisible] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  // function to convert a string with tags separated by commas into an array of tags
  function stringToTagsArray(string) {
    return string.split(",").map((tag) => tag.trim());
  }

  const [tagsArray, setTagsArray] = useState(stringToTagsArray(noteTags));

  const showInput = () => {
    setInputVisible(true);
  };

  const tagPlusStyle = {
    borderStyle: "dashed",
    margin: "0.3rem",
  };

  function handleInputConfirm(event) {
    if (event.key === "Enter" || event.type === "blur") {
      let newTag = event.target.value;

      // if the tag is empty, do nothing
      if (newTag === "") {
        event.target.value = "";
        setInputVisible(false);
        return;
      }
      // remove spaces at the beginning and end of the tag
      newTag = newTag.trim();

      // si hay varias tags separadas por comas las agrega como tags separadas
      if (newTag.includes(",")) {
        newTag = stringToTagsArray(newTag);
        setTagsArray((prev) => {
          return [...prev, ...newTag];
        });
        handleTags([...tagsArray, ...newTag]);
      }
      // si hay una sola tag la agrega
      else {
        setTagsArray((prev) => {
          return [...prev, newTag];
        });
        handleTags([...tagsArray, newTag]);
      }

      event.target.value = "";
      setInputVisible(false);
    }
  }

  return (
    /* display tags in tags array as buttons with an x icon for delete the tag */
    <div className="tags" style={{ margin: "0.7rem" }}>
      {tagsArray.map((tag, index) => {
        return (
          <Tag
            style={{ margin: "0.3rem" }}
            color="blue"
            key={index}
            closable
            onClose={(e) => {
              e.preventDefault();
              let filtrado = tagsArray.filter((prevTag) => {
                console.log(tagsArray);
                return prevTag !== tag;
              });
              setTagsArray(filtrado);
              handleTags(filtrado);
            }}
          >
            {tag}
          </Tag>
        );
      })}

      {inputVisible && (
        <input
          style={{
            width: "70px",
            margin: "0.2rem",
            fontSize: "0.8rem",
            outlineColor: "dodgerblue",
          }}
          ref={inputRef}
          type="text"
          placeholder="add tags"
          onKeyDown={handleInputConfirm}
          onBlur={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag color="orange" onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  );
}
