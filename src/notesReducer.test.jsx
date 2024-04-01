import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import { notesReducer } from "./notesReducer";

//? Tiene sentido este tipo de tests cuando el redeucer es muy simple? No estamos testeando implementación? No convendría hacer un test de integración para testear el comportamiento a la vista del usuario?

describe("notesReducer", () => {
  test('handles "get" action, replacing state with provided notes', () => {
    const initialState = [];
    const newNotes = [{ id: 1, content: "Note 1" }];
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "get", notes: newNotes })
    );

    expect(result.current).toEqual(newNotes);
  });

  test('handles "added" action, prepending new note to existing notes', () => {
    const initialState = [{ id: 1, content: "Note 1" }];
    const newNote = { id: 2, content: "Note 2" };
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "added", note: newNote })
    );

    expect(result.current).toEqual([newNote, ...initialState]);
  });

  test('handles "updated" action, replacing note with matching ID', () => {
    const initialState = [
      { id: 1, content: "Old Content" },
      { id: 2, content: "Another Note" },
    ];
    const updatedNote = { id: 1, content: "Updated Content" };
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "updated", note: updatedNote })
    );

    expect(result.current).toEqual([updatedNote, ...initialState.slice(1)]);
  });

  test('handles "deleted" action, removing note with matching ID', () => {
    const initialState = [
      { id: 1, content: "Note 1" },
      { id: 2, content: "Note 2" },
    ];
    const deleteId = 1;
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "deleted", deleteId })
    );

    expect(result.current).toEqual([initialState[1]]);
  });

  test("throws error for unsupported action types", () => {
    const initialState = [];
    expect(() =>
      notesReducer(initialState, { type: "unsupported" })
    ).toThrowError("Unknown action: unsupported");
  });

  test('handles "deleted" action with non-existent ID, returning unchanged state', () => {
    const initialState = [
      { id: 1, content: "Note 1" },
      { id: 2, content: "Note 2" },
    ];
    const deleteId = 3; // Non-existent ID
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "deleted", deleteId })
    );

    expect(result.current).toEqual(initialState);
  });

  test('handles "updated" action with invalid ID, returning unchanged state', () => {
    const initialState = [
      { id: 1, content: "Note 1" },
      { id: 2, content: "Note 2" },
    ];
    const invalidId = -1; // Invalid ID
    const updatedNote = { id: invalidId, content: "Updated Content" };
    const { result } = renderHook(() =>
      notesReducer(initialState, { type: "updated", note: updatedNote })
    );

    expect(result.current).toEqual(initialState);
  });
});
