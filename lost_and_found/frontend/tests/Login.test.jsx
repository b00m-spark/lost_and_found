import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../src/pages/Login";
import * as api from "../src/services/api.js";

// Replaces api.js with a fake stub so that whenever any component imports login from api.js, 
// give them a fake spy function (vi.fn()) instead of the real function that makes network calls
vi.mock("../src/services/api.js", () => ({
  login: vi.fn(),
}));

//a stub router: routes to an actual Login page and a fake profile page
function renderLogin(setCurrentUser = vi.fn()) {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/profile/:id" element={<div>Profile page loaded</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// a group of related tests for the login page
describe("Login page", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  
  // each it() is a test
  it("renders the login form", () => {
    renderLogin();
    //expects: make sure all the elements of the login form are present
    expect(screen.getByRole("heading", { name: /lost & found/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create an account/i })).toBeInTheDocument();
  });

  it("logs in and navigates to the profile page when credentials are accepted", async () => {
    const user = userEvent.setup(); // sets up for typing and clicking events
    const setCurrentUser = vi.fn();
    const mockUser = { id: 12, name: "Josie Bruin", email: "josie@example.com" };

    // Mock the API login function to resolve with a successful response
    api.login.mockResolvedValueOnce({
      message: "Login successful",
      user: mockUser,
    });

    // Sets up the routes
    renderLogin(setCurrentUser);

    // User types in email and password, then clicks the continue button
    await user.type(screen.getByLabelText(/email/i), mockUser.email);
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Because we previously set up api.login and setCurrentUser to be stub spy functions, 
    // we can inspect whether it was called with the correct arguments
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: mockUser.email,
        password: "password123",
      });
    });
    expect(setCurrentUser).toHaveBeenCalledWith(mockUser);

    // the browser should direct to /profile/:id, which we set up to render a fake profile page that contains "Profile page loaded"
    expect(await screen.findByText("Profile page loaded")).toBeInTheDocument();
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();
    
    // mock the API login function to reject with an error
    api.login.mockRejectedValueOnce(new Error("Invalid password"));

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "badpassword");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/check the account information you entered/i)
    ).toBeInTheDocument();
  });
});
