import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Layout from "../src/layouts/Layout";
import { API_BASE } from "../src/services/api.js";

let submittedForm;

const createdPost = {
  id: 42,
  title: "Found water bottle",
  post_type: "Found",
  description: "Blue bottle near Powell Library",
  category: "Bottle",
  address: "Powell Library",
  contact: "josie@example.com",
  status: "Open",
};

//Creates fake network server inside Node.js that intercepts requests and returns fake responses. 
const server = setupServer(
  http.post(`${API_BASE}/posts`, async ({ request }) => {
    submittedForm = await request.formData(); //intercepts the form received store into submittedForm
    return HttpResponse.json({ postId: 42 }); //returns a fake response
  }),
  http.get(`${API_BASE}/posts/:postId`, ({ params }) => {
    if (params.postId !== "42") {
      return HttpResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return HttpResponse.json(createdPost);
  })
);

function renderCreatePost(setPosts = vi.fn(), setCardOpen = vi.fn()) {
  render(
    <MemoryRouter>
      <Layout
        currentUser={{ id: 1, name: "Josie Bruin" }}
        cardOpen={true}
        setCardOpen={setCardOpen}
        setPosts={setPosts}
        onPostClick={vi.fn()}
      />
    </MemoryRouter>
  );
}

async function fillRequiredPostFields(user) {
  await user.type(screen.getByLabelText(/title/i), createdPost.title);
  await user.selectOptions(screen.getByLabelText(/type/i), "Found");
  await user.type(screen.getByLabelText(/description/i), createdPost.description);
  await user.selectOptions(screen.getByLabelText(/category/i), "Bottle");
  await user.type(screen.getByLabelText(/location/i), createdPost.address);
  await user.type(screen.getByLabelText(/contact/i), createdPost.contact);
}

describe("Create post flow with MSW", () => {
  let consoleErrorSpy;

  // Turn the server on before all tests, and turn it off after all tests.
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  beforeEach(() => {
    submittedForm = undefined;
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    server.resetHandlers();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => server.close());

  it("submits the report form and adds the created post to local state", async () => {
    const user = userEvent.setup();
    const setPosts = vi.fn();
    const setCardOpen = vi.fn();

    renderCreatePost(setPosts, setCardOpen);

    // Fill in the form and click submit
    await fillRequiredPostFields(user);
    await user.click(screen.getByRole("button", { name: /report/i }));

    // wait for the http request to be intercepted and the form data to be captured
    await waitFor(() => expect(submittedForm?.get).toEqual(expect.any(Function)));
    // check that the form data matches what we expect
    expect(submittedForm.get("title")).toBe(createdPost.title);
    expect(submittedForm.get("post_type")).toBe("Found");
    expect(submittedForm.get("description")).toBe(createdPost.description);
    expect(submittedForm.get("category")).toBe("Bottle");
    expect(submittedForm.get("address")).toBe(createdPost.address);
    expect(submittedForm.get("contact")).toBe(createdPost.contact);

    // we expect the setPosts function to be called
    await waitFor(() => expect(setPosts).toHaveBeenCalled());

    // Because we stubbed the setPost function, we can check that it's called, but the React state of posts aren't actually set with our new post
    // So we manually add the created post to the previous posts and check that the new array is correct
    //mock.calls[0][0] is the first argument of the first call to setPosts, 
    //which is a function that takes the previous posts and returns the new posts
    const updatePosts = setPosts.mock.calls[0][0];
    expect(updatePosts(["Existing post"])).toEqual([createdPost, "Existing post"]);

    // Test that the form is closed
    expect(setCardOpen).toHaveBeenCalledWith(false);
  });

  it("does not update posts when the backend rejects the create request", async () => {
    const user = userEvent.setup();
    const setPosts = vi.fn();
    const setCardOpen = vi.fn();

    //temporariliy override the server response to simulate a backend rejection, and checks if frontend behaves expectedly
    server.use(
      http.post(`${API_BASE}/posts`, async ({ request }) => {
        submittedForm = await request.formData();
        return HttpResponse.json({ message: "Not logged in" }, { status: 401 });
      })
    );

    renderCreatePost(setPosts, setCardOpen);

    await fillRequiredPostFields(user);
    await user.click(screen.getByRole("button", { name: /report/i }));

    await waitFor(() => expect(submittedForm?.get).toEqual(expect.any(Function)));
    expect(setPosts).not.toHaveBeenCalled();
  });
});
