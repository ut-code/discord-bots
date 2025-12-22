# Agents Guide

This file provides guidance to coding agents when working with code in this repository.

## Overview

This is an auto-moderator application that monitors task deadlines in a Notion database and sends reminders to Discord. It fetches tasks with deadlines within 3 days that are not marked as completed, formats them with assignee mentions, and sends notifications via Discord webhook.

## Development Commands

- **Start the application**: `bun run start`
- **Type checking**: `bun run ci` or `bunx tsc`
- **Linting and formatting**: `biome check --write` (configured for 120 character line width, 2-space indentation)

## Project Structure

The codebase is organized into 4 focused TypeScript modules:

- **`src/main.ts`**: Main application logic that orchestrates task fetching, formatting, and notification sending
- **`src/validator.ts`**: Valibot schemas for validating Notion API responses and type definitions
- **`src/io.ts`**: I/O utilities for environment variables, retry logic, Discord webhooks, and Notion API queries  
- **`src/data.ts`**: Static mapping between Notion user names and Discord user IDs for @mentions

## Architecture

The application follows a functional architecture with clear separation:

1. **Data Layer**: Notion API integration with type-safe schema validation using Valibot
2. **Business Logic**: Task filtering (3-day deadline window), formatting with Discord mentions
3. **I/O Layer**: Discord webhook notifications with retry mechanism

## Environment Variables

Required environment variables:
- `NOTION_API_KEY`: Notion integration token
- `DISCORD_WEBHOOK_URL`: Discord webhook URL for notifications

## Git Hooks

Lefthook is configured for pre-commit hooks:
- Biome formatting and linting with auto-fix
- TypeScript type checking

Run `lefthook install` to set up hooks.

## Technology Stack

- **Runtime**: Bun
- **Language**: TypeScript with strict mode
- **Validation**: Valibot for runtime type safety
- **APIs**: Notion API v2022-06-28, Discord webhooks
- **Tooling**: Biome for linting/formatting, Lefthook for git hooks
