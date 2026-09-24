# Project Agent

This directory defines the local knowledge layer for the Chatbot Repository Engineer.

## V1

The first version keeps repository intelligence lightweight:

- index.json contains a compact inventory of project files.
- scripts/agent/index.ts rebuilds the inventory from the repository.
- The generated index is intentionally excluded from Git so it never becomes stale source-of-truth.

## Principle

The repository is the source of truth. The index is only a retrieval aid for the engineering agent.

Future versions can extend this layer with symbols, dependencies, architecture relationships, test mapping, bugs, and engineering decisions without sending the entire repository to the model on every request.
