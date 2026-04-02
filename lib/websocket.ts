const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "wss://botios-staging.fly.dev";

export type WSServerMessage =
  | { type: "text_chunk"; content: string }
  | { type: "text_done" }
  | { type: "token"; text: string }
  | { type: "done"; metadata?: Record<string, unknown> }
  | { type: "typing" }
  | { type: "auth_ok"; userId: string }
  | { type: "module_saved"; module: string; itemType: string; summary: string; id: string }
  | { type: "phantom_expired" }
  | { type: "entity_detected"; entities: unknown[] }
  | { type: "replace_text"; text: string }
  | { type: "error"; code: string; message: string }
  | { type: "ping" };

export interface WSMessageContext {
  lang?: string;
  isPhantom?: boolean;
  phantomSubMode?: string;
  isFirstToday?: boolean;
}

export type WSClientMessage =
  | { type: "message"; content: string; conversationId?: string; anonToken?: string; context?: WSMessageContext }
  | { type: "pong" };

type MessageHandler = (msg: WSServerMessage) => void;
type StatusHandler = (status: "connected" | "disconnected" | "reconnecting") => void;

export class ZaelynWS {
  private ws: WebSocket | null = null;
  private token: string;
  private onMessage: MessageHandler;
  private onStatus: StatusHandler;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 2000;
  private destroyed = false;

  constructor(token: string, onMessage: MessageHandler, onStatus: StatusHandler) {
    this.token = token;
    this.onMessage = onMessage;
    this.onStatus = onStatus;
    this.connect();
  }

  private connect() {
    if (this.destroyed) return;
    try {
      this.ws = new WebSocket(`${WS_URL}/api/v1/portal/stream?token=${encodeURIComponent(this.token)}`);

      this.ws.onopen = () => {
        this.reconnectDelay = 2000;
        this.onStatus("connected");
      };

      this.ws.onmessage = (e) => {
        try {
          const raw = JSON.parse(e.data) as WSServerMessage;

          if (raw.type === "ping") { this.send({ type: "pong" }); return; }
          if (raw.type === "typing" || raw.type === "auth_ok") return;

          // Normalize backend types → portal types
          if (raw.type === "token") {
            this.onMessage({ type: "text_chunk", content: (raw as { type: "token"; text: string }).text });
            return;
          }
          if (raw.type === "done") {
            this.onMessage({ type: "text_done" });
            return;
          }

          this.onMessage(raw);
        } catch { /* ignore malformed messages */ }
      };

      this.ws.onerror = () => { /* handled by onclose */ };

      this.ws.onclose = () => {
        if (this.destroyed) return;
        this.onStatus("reconnecting");
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 30000);
          this.connect();
        }, this.reconnectDelay);
      };
    } catch {
      this.onStatus("disconnected");
    }
  }

  send(msg: WSClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendMessage(
    content: string,
    conversationId?: string,
    anonToken?: string,
    context?: WSMessageContext
  ) {
    this.send({
      type: "message",
      content,
      ...(conversationId ? { conversationId } : {}),
      ...(anonToken ? { anonToken } : {}),
      ...(context ? { context } : {}),
    });
  }

  destroy() {
    this.destroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
