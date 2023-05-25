/*  create react functional component for managing tags
 receives a string with the tags separated by commas
 display the tags as buttons that can be removed
 it also has an input field to add new tags
 it also recives a function to update the tags in the note
*/

//! TODO: además del estilo hay que hacer que no acepte tags vacios y que no acepte tags repetidos, y que no acepte tags con espacios al principio o al final, y que si hay comas separe las tags

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
  };

  function handleInputConfirm(e) {
    if (e.key === "Enter" || e.type === "blur") {
      let newTag = e.target.value;
      setTagsArray((prev) => {
        return [...prev, newTag];
      });
      handleTags([...tagsArray, newTag]);
      e.target.value = "";
      setInputVisible(false);
    }
  }

  return (
    /* display tags in tags array as buttons with an x icon for delete the tag */
    <div className="tags" style={{margin: "1rem"}}>
      {tagsArray.map((tag, index) => {
        return (
          <Tag
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
          style={{ fontSize: "0.8rem", outlineColor: "dodgerblue" }}
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
