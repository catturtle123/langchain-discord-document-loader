import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";
import { Document } from "@langchain/core/documents";

/**
 * DiscordChatLoader
 *
 * Load Discord chat logs from an array of records (like a Pandas DataFrame).
 */
export class DiscordChatLoader extends BaseDocumentLoader {
  private chatLog: Record<string, any>[];
  private userIdCol: string;

  /**
   * Initialize with a list of chat log records.
   *
   * @param chatLog - Array of objects representing chat logs (like a DataFrame)
   * @param userIdCol - Name of the key containing the user ID. Defaults to "ID".
   */
  constructor(chatLog: Record<string, any>[], userIdCol = "ID") {
    super();

    if (!Array.isArray(chatLog)) {
      throw new Error(
        `Expected chatLog to be an array of objects, got ${typeof chatLog}`,
      );
    }

    this.chatLog = chatLog;
    this.userIdCol = userIdCol;
  }

  /**
   * Load all chat messages and convert them to LangChain Documents.
   *
   * @returns Promise resolving to an array of Documents
   */
  async load(): Promise<Document[]> {
    const result: Document[] = [];

    for (const row of this.chatLog) {
      const userId = row[this.userIdCol];

      if (userId === undefined) {
        throw new Error(
          `Row missing user_id_col "${this.userIdCol}": ${JSON.stringify(row)}`,
        );
      }

      const metadata = { ...row };
      delete metadata[this.userIdCol];

      result.push(
        new Document({
          pageContent: String(userId),
          metadata,
        }),
      );
    }

    return result;
  }
}
