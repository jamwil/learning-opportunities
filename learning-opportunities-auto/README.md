# learning-opportunities-auto

A companion pi extension for [learning-opportunities](../learning-opportunities/) that automatically detects good moments to offer learning exercises.

Instead of relying on the model to notice opportunities on its own, this extension watches successful `bash` tool calls for `git commit` and nudges pi to consider whether the just-committed work is a good fit for a short learning exercise.

**Requires:** the main `learning-opportunities` pi package should also be installed.

## How It Works

When pi executes a successful `git commit` through the `bash` tool, this extension injects a hidden context nudge telling the model to consider offering a 10-15 minute learning exercise if the work involved things like:

- new files or modules
- schema changes
- architectural decisions or refactors
- unfamiliar patterns

It caps itself at 2 offers per session and also stops after it detects a simple declined response such as `no`, `skip`, or `not now`.

## Installation

This extension is packaged separately inside this repository.

1. Clone the repo:
   ```bash
   git clone https://github.com/DrCatHicks/learning-opportunities.git
   cd learning-opportunities
   ```

2. Install the main skills package:
   ```bash
   pi install .
   ```

3. Install the auto extension package:
   ```bash
   pi install ./learning-opportunities-auto
   ```

4. If pi is already running, reload resources:
   ```text
   /reload
   ```

If you want to disable it later, use `pi config`.

## Implementation Notes

- Pi version: implemented as an extension in `extensions/index.ts`
- Trigger: `tool_result` event for successful `bash` executions matching `git commit`
- Delivery: injects a hidden custom message before the model's next turn
- State: stores offer/decline markers in session entries so behavior survives reloads

## Claude Code

The original Claude Code hook implementation is still kept in this directory under `hooks/` for the Claude plugin version of this project.

## License

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
