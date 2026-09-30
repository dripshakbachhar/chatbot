import { auth } from "@/app/(auth)/auth";
import {
  getDocumentById,
  getSuggestionsByDocumentId,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new ChatbotError(
      "bad_request:api",
      "Parameter documentId is required."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:suggestions").toResponse();
  }

  const document = await getDocumentById({ id: documentId });

  if (!document) {
    return new ChatbotError("not_found:document").toResponse();
  }

  if (document.userId !== session.user.id) {
    return new ChatbotError("forbidden:api").toResponse();
  }

  const suggestions = await getSuggestionsByDocumentId({
    documentId,
    userId: session.user.id,
  });

  return Response.json(suggestions, { status: 200 });
}
