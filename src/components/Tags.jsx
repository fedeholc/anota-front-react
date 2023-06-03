/*  create react functional component for managing tags
 receives a string with the tags separated by commas
 display the tags as buttons that can be removed
 it also has an input field to add new tags
 it also recives a function to update the tags in the note
*/

import { useState, useRef, useEffect } from "react";
import { Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Tags.css";
import { getTagsArray } from "../utilityFunctions";
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

  const [tagsArray, setTagsArray] = useState(getTagsArray(noteTags));

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
        newTag = getTagsArray(newTag);
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
    <div className="tags__container">
      {tagsArray.map((tag, index) => {
        return (
          tag && (
            <Tag
              className="tag__component"
              color="blue"
              key={index}
              closable
              onClose={(event) => {
                event.preventDefault();
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
          )
        );
      })}

      {inputVisible && (
        <input
          className="tag__new-tag-input"
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
