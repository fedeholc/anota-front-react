// funciones utilizadas para interactuar con la base de datos

const API_URL = import.meta.env.VITE_API_URL;

export async function dbGetNotes(usuario) {
  try {
    let response = await fetch(`${API_URL}/${usuario}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation: " + error.message
    );
  }
}

export function dbAddNote(note) {
  fetch(`${API_URL}/${note.usuario}`, {
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

export function dbDeleteNote(id) {
  fetch(`${API_URL}/${id}`, {
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

  fetch(`${API_URL}/${note.usuario}`, {
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
