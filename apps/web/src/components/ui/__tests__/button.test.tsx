import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies default variant styles", () => {
    render(<Button data-testid="btn">Default</Button>);
    expect(screen.getByTestId("btn")).toHaveClass("bg-card");
    expect(screen.getByTestId("btn")).toHaveClass("border");
  });

  it("applies ghost variant styles", () => {
    render(
      <Button variant="ghost" data-testid="btn">
        Ghost
      </Button>,
    );
    expect(screen.getByTestId("btn")).toHaveClass("hover:bg-sidebar-hover");
  });

  it("applies destructive variant styles", () => {
    render(
      <Button variant="destructive" data-testid="btn">
        Delete
      </Button>,
    );
    expect(screen.getByTestId("btn")).toHaveClass("bg-destructive");
  });

  it("applies size sm", () => {
    render(
      <Button size="sm" data-testid="btn">
        Small
      </Button>,
    );
    expect(screen.getByTestId("btn")).toHaveClass("h-8");
  });

  it("applies size icon", () => {
    render(
      <Button size="icon" data-testid="btn">
        I
      </Button>,
    );
    expect(screen.getByTestId("btn")).toHaveClass("h-9");
    expect(screen.getByTestId("btn")).toHaveClass("w-9");
  });

  it("merges custom className", () => {
    render(
      <Button className="my-class" data-testid="btn">
        Custom
      </Button>,
    );
    expect(screen.getByTestId("btn")).toHaveClass("my-class");
  });

  it("renders as a link when asChild with Slot", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("inline-flex");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("accepts type prop", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
