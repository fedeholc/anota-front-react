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
