import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import App from "./App";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);
    screen.debug();
    expect(screen.getByText(/anota/i)).toBeInTheDocument();
  });
  it("title snapshot", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
