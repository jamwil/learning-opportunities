import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const STATE_ENTRY = "learning-opportunities-auto-state";
const OFFER_LIMIT = 2;
const OFFER_CONTEXT =
	"[learning-opportunities-auto] The user just committed code. Per the learning-opportunities skill, consider whether this is a good moment to offer a learning exercise. If the committed work involved new files, schema changes, architectural decisions, refactors, or unfamiliar patterns, ask the user (one short sentence) if they'd like a 10-15 minute exercise. Do not start the exercise until they confirm. If they decline, note it — no more offers this session.";

function isGitCommit(command: unknown): command is string {
	return typeof command === "string" && /(^|\s|&&|\|\|)git\s+commit(\s|$)/.test(command);
}

function isDecline(text: string): boolean {
	return /^(?:no|nope|nah|skip|pass|later|not now|not right now|maybe later)\b/.test(text);
}

function isAcceptance(text: string): boolean {
	return /^(?:yes|yep|yeah|sure|ok|okay|please|go ahead|sounds good|let'?s do it|lets do it)\b/.test(text);
}

export default function learningOpportunitiesAuto(pi: ExtensionAPI) {
	let offers = 0;
	let declined = false;
	let awaitingReply = false;

	function restoreState(entries: any[]) {
		offers = 0;
		declined = false;
		awaitingReply = false;

		for (const entry of entries) {
			if (entry.type !== "custom" || entry.customType !== STATE_ENTRY) continue;
			const event = entry.data?.event;
			if (event === "offer") {
				offers += 1;
				awaitingReply = true;
			} else if (event === "declined") {
				declined = true;
				awaitingReply = false;
			} else if (event === "accepted") {
				awaitingReply = false;
			}
		}
	}

	function record(event: "offer" | "accepted" | "declined", data?: Record<string, unknown>) {
		pi.appendEntry(STATE_ENTRY, {
			event,
			timestamp: Date.now(),
			...data,
		});
	}

	pi.on("session_start", async (_event, ctx) => {
		restoreState(ctx.sessionManager.getEntries());
	});

	pi.on("input", async (event) => {
		if (!awaitingReply || event.source === "extension") {
			return { action: "continue" as const };
		}

		const text = event.text.trim().toLowerCase();
		if (!text) {
			return { action: "continue" as const };
		}

		if (isDecline(text)) {
			declined = true;
			awaitingReply = false;
			record("declined");
		} else if (isAcceptance(text)) {
			awaitingReply = false;
			record("accepted");
		}

		return { action: "continue" as const };
	});

	pi.on("tool_result", async (event) => {
		if (event.toolName !== "bash") return;
		if (event.isError) return;
		if (declined || offers >= OFFER_LIMIT) return;
		if (!isGitCommit(event.input?.command)) return;

		offers += 1;
		awaitingReply = true;
		record("offer", { command: event.input.command });

		pi.sendMessage(
			{
				customType: "learning-opportunities-auto",
				content: OFFER_CONTEXT,
				display: false,
			},
			{ deliverAs: "steer" },
		);
	});
}
