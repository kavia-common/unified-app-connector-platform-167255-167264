import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { ConnectorSelector } from "@/components/ConnectorSelector";
import { SearchOverlay } from "@/components/SearchOverlay";
import { Chat } from "@/components/chat/Chat";
import * as apiModule from "@/lib/api";

describe("ConnectorSelector", () => {
  it("renders options and calls onSelect", () => {
    const connectors = { jira: { name: "Jira" }, confluence: { name: "Confluence" } };
    const onSelect = vi.fn();
    render(<ConnectorSelector connectors={connectors} selected={null} onSelect={onSelect} />);
    const jira = screen.getByText(/Jira/i);
    fireEvent.click(jira);
    expect(onSelect).toHaveBeenCalledWith("jira");
  });
});

describe("SearchOverlay", () => {
  it("submits search and shows results", async () => {
    const spy = vi.spyOn(apiModule, "api", "get");
    (spy as any).search = vi.fn().mockResolvedValue({ items: [{ id: "1", title: "Found" }] });
    render(<SearchOverlay tenantId="t1" authHeader={null} onClose={() => {}} onSelectProvider={() => {}} />);
    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: "hello" } });
    const button = screen.getByRole("button", { name: /Search/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("Found")).toBeInTheDocument();
    });
    spy.mockRestore();
  });
});

describe("Chat", () => {
  it("renders and sends a message", async () => {
    const spy = vi.spyOn(apiModule, "api", "get");
    (spy as any).search = vi.fn().mockResolvedValue({ items: [{ id: "1", title: "Result" }] });

    render(<Chat provider="jira" tenantId="t1" connectionId="c1" authHeader={null} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "query" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Result/)).toBeInTheDocument();
    });
    spy.mockRestore();
  });
});

describe("Home page", () => {
  it("loads connectors and shows buttons", async () => {
    const spy = vi.spyOn(apiModule, "api", "get");
    (spy as any).listConnectors = vi.fn().mockResolvedValue({ jira: { name: "Jira" } });
    render(<Home />);
    expect(await screen.findByRole("button", { name: /Open search overlay/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});
