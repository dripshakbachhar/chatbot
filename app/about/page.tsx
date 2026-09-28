import {
  BracesIcon,
  DatabaseIcon,
  FileTextIcon,
  GithubIcon,
  LockKeyholeIcon,
  MessageSquareIcon,
  PaperclipIcon,
  ServerCogIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: MessageSquareIcon,
    title: "Streaming conversations",
    description:
      "Send prompts and receive streamed responses while conversations stay organized in persistent chat history.",
  },
  {
    icon: SparklesIcon,
    title: "Curated AI models",
    description:
      "Choose from a maintained set of models available through Vercel AI Gateway, with capability-aware model selection.",
  },
  {
    icon: PaperclipIcon,
    title: "Files and documents",
    description:
      "Attach supported files and use document creation and editing workflows directly from the chat experience.",
  },
  {
    icon: DatabaseIcon,
    title: "Persistent data",
    description:
      "PostgreSQL and Drizzle store accounts, conversations, messages, votes, documents, and resumable stream state.",
  },
];

const stack = [
  ["Application", "Next.js 16, React 19, TypeScript"],
  ["AI", "Vercel AI SDK + Vercel AI Gateway"],
  ["Authentication", "NextAuth credentials-based sessions"],
  ["Data", "PostgreSQL + Drizzle ORM"],
  ["Storage", "Vercel Blob for uploaded files"],
  ["Testing", "Playwright end-to-end coverage + GitHub Actions"],
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8 md:py-14">
        <header className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquareIcon aria-hidden="true" className="size-4" />
            <span>Chatbot</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            A focused AI workspace for conversations and documents.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This chatbot combines streaming AI conversations, persistent
            history, file workflows, and a small set of curated models in one
            responsive interface.
          </p>
        </header>

        <section aria-labelledby="capabilities-heading" className="mt-10">
          <h2 id="capabilities-heading" className="text-lg font-semibold">
            What it does
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article
                className="rounded-xl border border-border/60 bg-card p-5"
                key={title}
              >
                <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="models-heading" className="mt-10">
          <div className="rounded-xl border border-border/60 bg-card p-5 md:p-6">
            <div className="flex items-start gap-3">
              <SparklesIcon
                aria-hidden="true"
                className="mt-0.5 size-5 text-muted-foreground"
              />
              <div>
                <h2 id="models-heading" className="font-semibold">
                  Supported AI models
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The current curated set is DeepSeek V3.2, Kimi K2.5, GPT OSS
                  20B, GPT OSS 120B, and Grok 4.1 Fast. The model allowlist is
                  maintained in the application code rather than exposing an
                  unrestricted provider catalog.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="architecture-heading" className="mt-10">
          <h2 id="architecture-heading" className="text-lg font-semibold">
            Built with
          </h2>
          <dl className="mt-4 divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
            {stack.map(([label, value]) => (
              <div
                className="grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr] sm:gap-4"
                key={label}
              >
                <dt className="text-sm font-medium">{label}</dt>
                <dd className="text-sm text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="security-heading" className="mt-10">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: LockKeyholeIcon,
                title: "Authentication",
                text: "Accounts use NextAuth sessions and database-backed credentials.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Security",
                text: "Secrets stay in environment configuration, while model access is restricted by an explicit allowlist.",
              },
              {
                icon: ServerCogIcon,
                title: "Production",
                text: "The application is designed for Vercel with PostgreSQL, Blob storage, and AI Gateway.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                className="rounded-xl border border-border/60 bg-card p-5"
                key={title}
              >
                <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BracesIcon aria-hidden="true" className="size-4" />
            <span>Open-source project repository</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="inline-flex items-center gap-2 hover:text-foreground"
              href="https://github.com/dripshakbachhar/chatbot"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon aria-hidden="true" className="size-4" />
              Repository
            </Link>
            <Link className="inline-flex items-center gap-2 hover:text-foreground" href="/">
              <FileTextIcon aria-hidden="true" className="size-4" />
              Back to chat
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
