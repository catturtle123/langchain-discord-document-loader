import { DiscordChatLoader } from "../src/discord_loader";
import { Document } from "@langchain/core/documents";

describe("DiscordChatLoader", () => {
  test("✅ should correctly convert chat log array into Documents", async () => {
    // Test data simulating a DataFrame-like structure
    const data = [
      {
        ID: "Jamey",
        Message: "Hey, are you ready for the meeting today?",
        Timestamp: "2025-10-19 09:00",
      },
      {
        ID: "Bot",
        Message: "Jamey, the meeting starts at 3 PM.",
        Timestamp: "2025-10-19 09:01",
      },
      {
        ID: "Jamey",
        Message: "Got it, thanks!",
        Timestamp: "2025-10-19 09:05",
      },
    ];

    const loader = new DiscordChatLoader(data, "ID");
    const docs: Document[] = await loader.load();

    // ✅ Test 1: number of documents
    expect(docs).toHaveLength(3);

    // ✅ Test 2: verify the first document content
    expect(docs[0].pageContent).toBe("Jamey");
    expect(docs[0].metadata.Message).toBe("Hey, are you ready for the meeting today?");
    expect(docs[0].metadata.Timestamp).toBe("2025-10-19 09:00");

    // ✅ Test 3: verify each document type and metadata
    for (const d of docs) {
      expect(d).toBeInstanceOf(Document);
      expect(typeof d.metadata).toBe("object");
      expect(d.metadata).toHaveProperty("Message");
    }
  });

  test("❌ should throw an error when input is not an array", () => {
    const invalidInput = { ID: "Jamey", Message: "Hello" } as any;

    expect(() => new DiscordChatLoader(invalidInput)).toThrow(
      /Expected chatLog to be an array of objects/
    );
  });
});