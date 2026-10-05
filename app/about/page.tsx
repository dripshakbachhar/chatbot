import {
  DatabaseIcon,
  FileTextIcon,
  LockKeyholeIcon,
  MessageSquareTextIcon,
  ServerCogIcon,
  SparklesIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Chatbot",
  description: "Learn how this Chatbot application works and what powers it.",
};

const capabilities = [
  {
    icon: MessageSquareTextIcon,
    title: "AI conversations",
    description:
      "Stream responses from a curated set of AI models through the Vercel AI Gateway.",
  },
  {
    icon: DatabaseIcon,
    title: "Persistent chats",
    description:
      "Authenticated users can keep conversations, messages, votes, and chat metadata in PostgreSQL.",
  },
  {
    icon: FileTextIcon,
    title: "Documents and files",
    description:
      "Work with attachments and document-oriented tools inside the same chat experience.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Authentication",
    description:
      "NextAuth provides credential-based accounts and guest sessions while keeping protected data scoped to users.",
  },
  {
    icon: ServerCogIcon,
    title: "Production architecture",
    description:
      "Next.js App Router, Drizzle ORM, PostgreSQL, Vercel Blob, Redis, and Vercel provide the application foundation.",
  },
  {
    icon: SparklesIcon,
    title: "Built to be maintained",
    description:
      "The repository uses automated checks, database migrations, production builds, and Playwright end-to-end tests.",
  },
];

const models = [
  "DeepSeek V3.2",
  "Kimi K2.5",
  "GPT OSS 20B",
  "GPT OSS 120B",
  "Grok 4.1 Fast",
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            About this project
          </p>
          <h1 className="text-balance font-semibold text-3xl tracking-tight md:text-4xl">
            A focused chatbot built for useful work.
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground leading-7">
            This is a full-stack Next.js chatbot that combines streaming AI,
            authentication, persistent conversations, files, and document tools
            in one application. It is designed to stay practical: a clean UI,
            a clear backend, and an automated path from local development to
            production.
          </p>
        </header>

        <section aria-labelledby="capabilities-heading">
          <h2 className="font-semibold text-xl" id="capabilities-heading">
            What it provides
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  className="rounded-xl border border-border/60 bg-card p-5 shadow-sm"
                  key={capability.title}
                >
                  <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
                  <h3 className="mt-4 font-medium">{capability.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-6">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="models-heading"
          className="mt-12 rounded-xl border border-border/60 bg-card p-6"
        >
          <h2 className="font-semibold text-xl" id="models-heading">
            Current model selection
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-6">
            The model selector exposes the models currently configured by the
            application. Availability can change with provider configuration.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {models.map((model) => (
              <li
                className="rounded-lg border border-border/50 px-4 py-3 text-sm"
                key={model}
              >
                {model}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="security-heading"
          className="mt-12 border-border/60 border-t pt-8"
        >
          <h2 className="font-semibold text-xl" id="security-heading">
            Security and privacy
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground leading-6">
            Authentication and authorization are enforced on protected data,
            secrets belong in environment variables, and database changes are
            managed through migrations. The project does not treat a successful
            build as proof of production health; CI and deployment smoke tests
            are part of the operating workflow.
          </p>
        </section>

        <footer className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link className="text-muted-foreground underline-offset-4 hover:underline" href="/">
            Back to chat
          </Link>
          <a
            className="text-muted-foreground underline-offset-4 hover:underline"
            href="https://github.com/dripshakbachhar/chatbot"
            rel="noreferrer"
            target="_blank"
          >
            View source on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
