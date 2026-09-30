# Security Policy

## Scope

This project is an AI chatbot with authentication, persistent user data, file uploads, external model providers, and optional Redis-backed rate limiting.

## Reporting

Do not publish credentials, session tokens, private user data, or an exploit that exposes real user information in a public issue.

For sensitive vulnerabilities, use GitHub's private security-reporting mechanism when available. Otherwise open only a high-level public issue and request private contact.

## Security-sensitive areas

- authentication and session handling
- authorization and resource ownership
- file uploads and externally accessible URLs
- AI model/tool execution
- database queries
- environment variables and API keys
- rate limiting and abuse controls

## Secret handling

Never commit `.env.local`, production credentials, API keys, session secrets, database passwords, or private tokens. Use `.env.local` for local secrets and keep environment templates placeholder-only.
