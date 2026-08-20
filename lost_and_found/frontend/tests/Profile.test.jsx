import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../src/pages/Profile";
import * as api from "../src/services/api";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = vi.fn();

// Mock markResolved API
vi.spyOn(api, "markResolved").mockResolvedValue({ success: true });
vi.spyOn(api, "deletePost").mockResolvedValue({ success: true });

const mockUser = {
  id: 1,
  name: "Josie Bruin",
  email: "josieBruin@ucla.edu",
};

const mockPosts = [
  { id: 1, user_id: 1, title: "Lost Wallet", status: "Open" },
  { id: 2, user_id: 2, title: "Found Keys", status: "Open" },
];

describe("Profile component", () => {
  beforeEach(() => {
    fetch.mockReset();
    vi.clearAllMocks();
  });

  it("shows loading initially", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <MemoryRouter>
        <Profile posts={[]} setPosts={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // wait until loading finishes so test exits cleanly
    await screen.findByText(mockUser.name);
  });

  it("renders user info and posts correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <MemoryRouter>
        <Profile posts={mockPosts} setPosts={vi.fn()} />
      </MemoryRouter>
    );

    // user info
    expect(await screen.findByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    // posts filtered by user_id
    expect(screen.getByText("Lost Wallet")).toBeInTheDocument();
    expect(screen.queryByText("Found Keys")).not.toBeInTheDocument();
  });

  it("shows message when user has no posts", async () => {
    const noPostUser = {
      id: 99,
      name: "NoPost",
      email: "nopost@test.com",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => noPostUser,
    });

    render(
      <MemoryRouter>
        <Profile posts={mockPosts} setPosts={vi.fn()} />
      </MemoryRouter>
    );

    expect(await screen.findByText("NoPost")).toBeInTheDocument();
    expect(screen.getByText("Report a Lost/Found item")).toBeInTheDocument();
  });

  it("switches tab correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <MemoryRouter>
        <Profile posts={mockPosts} setPosts={vi.fn()} />
      </MemoryRouter>
    );

    // wait for profile to load
    await screen.findByText(mockUser.name);

    const postsTab = screen.getByText("Posts");
    fireEvent.click(postsTab);

    expect(screen.getByText("Lost Wallet")).toBeInTheDocument();
  });

  it("removes a deleted post from local state", async () => {
    const setPosts = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <MemoryRouter>
        <Profile posts={mockPosts} setPosts={setPosts} />
      </MemoryRouter>
    );

    await screen.findByText(mockUser.name);
    fireEvent.click(screen.getByLabelText("Open post options"));
    fireEvent.click(screen.getByText("Delete Report"));

    await waitFor(() => expect(api.deletePost).toHaveBeenCalledWith(1));
    expect(setPosts).toHaveBeenCalled();

    const updatePosts = setPosts.mock.calls[0][0];
    expect(updatePosts(mockPosts)).toEqual([mockPosts[1]]);
  });
});
