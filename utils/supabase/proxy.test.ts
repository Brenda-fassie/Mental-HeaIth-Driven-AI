import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "./proxy";

// Mock Supabase SSR
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn((_url, _key, options) => ({
    auth: {
      getUser: vi.fn().mockImplementation(async () => {
        // Trigger setAll during getUser if needed (simulating session refresh)
        options.cookies.setAll([{ name: "sb-access-token", value: "test-token", options: {} }]);
        return { data: { user: {} }, error: null };
      }),
    },
  })),
}));

// Mock Next.js Server
vi.mock("next/server", () => {
  class MockNextRequest {
    cookies = {
      getAll: vi.fn(() => []),
      set: vi.fn(),
    };
    headers = new Headers();
    url = "http://localhost";
    constructor(url: string) {
      this.url = url;
    }
  }

  const nextResponseMock = {
    cookies: {
      set: vi.fn(),
    },
  };

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      next: vi.fn(() => nextResponseMock),
    },
  };
});

// Import NextRequest AFTER mocking
import { NextRequest, NextResponse } from "next/server";

describe("Supabase Proxy Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize a response and handle cookie propagation", async () => {
    const mockRequest = new NextRequest("http://localhost");
    const response = await createClient(mockRequest as any);

    // Verify NextResponse.next was called
    expect(NextResponse.next).toHaveBeenCalled();
    
    // Verify cookies were set on the response during the mock getUser (setAll)
    expect(response.cookies.set).toHaveBeenCalledWith(
      "sb-access-token", 
      "test-token", 
      expect.any(Object)
    );
  });
});
