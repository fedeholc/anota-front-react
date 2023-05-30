import { useState, useLayoutEffect } from "react";

// función que toma un string de tags separados por coma y devuelve un array de tags, sin espacios al principio ni al final, y sin tags vacíos
export function getTagsArray(tagsString) {
  const tagsArray = tagsString.split(",");
  tagsArray.forEach((tag, index) => {
    tagsArray[index] = tag.trim();
  });
  return tagsArray;
}

export function getFormattedDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);

  const currentDateTime =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return currentDateTime;
}

export function dateTimeJStoDB(dateTime) {
  return dateTime.slice(0, 10) + " " + dateTime.slice(11, 19);
}

//! TODO: revisar si lo estoy usando y para qué
export const useIsOverflow = (ref, callback) => {
  const [isOverflow, setIsOverflow] = useState();

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      // eslint-disable-next-line no-unused-vars
      const hasOverflow = current.scrollHeight > current.clientHeight;
      const divs = current.querySelectorAll(".note__body");
      const miarr = Array.from(divs);
      //console.log("divs:", divs);
      //console.log("miarr", miarr);
      let fede = miarr.map((e) => e.scrollHeight > e.clientHeight);
      //console.log("map", fede);
      /*       setIsOverflow(hasOverflow);
       */ setIsOverflow("fede");
      if (callback) callback(fede);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
