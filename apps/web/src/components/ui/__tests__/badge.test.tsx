import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Badge data-testid="badge">Test</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("bg-card");
  });

  it("applies accent variant classes", () => {
    render(
      <Badge variant="accent" data-testid="badge">
        Test
      </Badge>,
    );
    expect(screen.getByTestId("badge")).toHaveClass("bg-accent/10");
    expect(screen.getByTestId("badge")).toHaveClass("text-accent");
  });

  it("merges custom className", () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Test
      </Badge>,
    );
    expect(screen.getByTestId("badge")).toHaveClass("custom-class");
  });

  it("forwards extra props", () => {
    const onClick = vi.fn();
    render(
      <Badge onClick={onClick} data-testid="badge">
        Click
      </Badge>,
    );
    fireEvent.click(screen.getByTestId("badge"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
