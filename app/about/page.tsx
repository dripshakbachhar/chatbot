import {
  ArrowLeftIcon,
  DatabaseIcon,
  FileTextIcon,
  LockKeyholeIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const models = [
  "DeepSeek V3.2",
  "Kimi K2.5",
  "GPT OSS 20B",
  "GPT OSS 120B",
  "Grok 4.1 Fast",
];

const sections = [
  {
    icon: SparklesIcon,
    title: "AI conversations",
    description:
      "Stream responses through the Vercel AI SDK and switch between the curated models available in the application.",
  },
  {
    icon: DatabaseIcon,
    title: "Persistent workspace",
    description:
      "Authenticated users can keep conversations and related data in PostgreSQL through the application's Drizzle data layer.",
  },
  {
    icon: FileTextIcon,
    title: "Documents and files",
    description:
      "The workspace supports file attachments and document-oriented tools, backed by the application's storage and artifact flows.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Authentication and security",
    description:
      "Authentication is handled with NextAuth. Secrets belong in the local or Vercel environment, never in source control.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10 md:py-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/">
              <ArrowLeftIcon />
              Back to chat
            </Link>
          </Button>
          <span className="text-muted-foreground text-sm">About Chatbot</span>
        </div>

        <header className="mb-12 max-w-2xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl border bg-muted/50">
            <SparklesIcon className="size-5" />
          </div>
          <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
            A focused workspace for AI conversations
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-8">
            Chatbot is a Next.js application for streaming AI conversations,
            persistent chat history, model selection, and document-oriented
            workflows in one place.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ description, icon: Icon, title }) => (
            <section
              className="rounded-xl border bg-card p-6 shadow-xs"
              key={title}
            >
              <Icon className="size-5 text-muted-foreground" />
              <h2 className="mt-4 font-semibold text-lg">{title}</h2>
              <p className="mt-2 text-muted-foreground text-sm leading-6">
                {description}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border bg-muted/20 p-6 md:p-8">
          <h2 className="font-semibold text-xl">Available models</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {models.map((model) => (
              <span
                className="rounded-full border bg-background px-3 py-1.5 text-sm"
                key={model}
              >
                {model}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="font-semibold text-xl">Built with</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground text-sm leading-7">
            Next.js and React provide the application shell and routing. The
            Vercel AI SDK and AI Gateway power model access, PostgreSQL and
            Drizzle handle persistence, NextAuth handles authentication, and
            Playwright protects the user-facing flows with end-to-end tests.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a
                href="https://github.com/dripshakbachhar/chatbot"
                rel="noreferrer"
                target="_blank"
              >
                View repository
              </a>
            </Button>
            <Button asChild>
              <Link href="/">Start chatting</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
