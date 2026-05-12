# Learning Opportunities

Last verified: 2026-05-11

## What This Is

A cross-harness skills repository packaging science-based learning exercises for deliberate skill development during AI-assisted coding. It now includes both Claude Code plugin manifests and pi package manifests. Authors: Dr. Cat Hicks and Dr. Michael Mullarkey. License: CC-BY-4.0.

## Project Structure

- `package.json` - Root pi package manifest (`learning-opportunities` + `orient` skills)
- `.claude-plugin/marketplace.json` - Claude Code marketplace catalog (repo root is the marketplace)
- `learning-opportunities/` - Main skill package contents
  - `.claude-plugin/plugin.json` - Claude plugin manifest
  - `skills/learning-opportunities/` - Shared skill (SKILL.md + resources)
- `learning-opportunities-auto/` - Auto-prompting add-on
  - `package.json` - Separate pi package manifest for the extension
  - `extensions/index.ts` - pi extension implementation
  - `.claude-plugin/plugin.json` - Claude plugin manifest
  - `hooks/post-tool-use.sh` - Claude PostToolUse hook (bash)
- `orient/` - Orientation generator skill contents
  - `.claude-plugin/plugin.json` - Claude plugin manifest
  - `skills/orient/` - Shared skill (SKILL.md + resources)
- `CHANGELOG.md` - Release history for the Claude plugin releases

## Releasing a New Version

Each plugin has its own version. When releasing, update the version in three places atomically:

1. `<plugin>/.claude-plugin/plugin.json` — bump `version`
2. `.claude-plugin/marketplace.json` — bump the matching plugin entry's `version`
3. `CHANGELOG.md` — add entry at top, under the `# Changelog` heading

Use semver. All three files must show the same version string for the plugin being released. Commit all three together.

### Changelog format

```markdown
## <plugin-name> X.Y.Z

Brief description.

**New:**
- Additions

**Changed:**
- Modifications

**Fixed:**
- Bug fixes
```

Only include sections that apply.
