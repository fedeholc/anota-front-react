// funciones utilizadas para interactuar con la base de datos

const API_URL = import.meta.env.VITE_API_URL;

//TODO: hay que hacer el get con el usuario

export function dbGetNotes(usuario) {
  //FIXME: ojo que los datos vienen ordenados por PK (id)
  // habría que reordenar o modificar la consulta
  //FIXME: ojo, los boolean los convierte a 0 y 1, typeof number
  let data = fetch(`${API_URL}/get/${usuario}`)
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });
  return data;
}

export function dbAddNote(note) {
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
    .then((res) => {
      return res; // para ver el statustext usar: console.log(res.text());
    })
    .catch((error) => {
      console.error("hay error", error);
    });
}

export function dbDeleteNote(noteId) {
  fetch(`${API_URL}/del/${noteId}`, {
    method: "DELETE",
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function dbUpdateNote(note) {
  //ojo porque hay que tomar el html sino no guarda renglones
  //o sea tal vez tener siempre texto y html
  // para eso hay que sanitizar usando lo que usan
  //acá: https://codesandbox.io/s/l91xvkox9l?file=/src/index.js

  // TODO: separar de acá la parte de bd? poner async?

  fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
    .then((res) => {
      return res; // para ver el statustext usar: console.log(res.text());
    })
    .catch((error) => {
      console.error(error);
    });
}
