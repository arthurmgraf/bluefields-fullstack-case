#!/bin/bash
# .claude/hooks/stop-hook.sh
# Stop hook — logs response end events to .claude/sessions/.activity-log
#
# Note: this hook fires after EVERY agent response, not just at session close.
# For a full session summary, use the /end-session command before closing the tab.
#
# Input (stdin): JSON with session_id, transcript_path, cwd

INPUT=$(cat)
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)

# Extract session_id — use jq if available, fallback to grep
SESSION_ID="unknown"
if command -v jq >/dev/null 2>&1; then
    SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null)
else
    SESSION_ID=$(echo "$INPUT" | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4)
    [ -z "$SESSION_ID" ] && SESSION_ID="unknown"
fi

# Ensure sessions folder exists
mkdir -p .claude/sessions

# Append to activity log (single running file — not one per response)
echo "$TIMESTAMP | session=${SESSION_ID:0:8}" >> .claude/sessions/.activity-log

# Always exit 0 — never block Claude
exit 0
