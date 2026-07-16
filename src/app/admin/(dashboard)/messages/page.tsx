"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, MessageSquareReply, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageStatus } from "@/types";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

const STATUS_OPTS: { value: "all" | MessageStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "UNREAD", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
];

const STATUS_ICONS: Record<MessageStatus, React.ElementType> = {
  UNREAD: Mail,
  READ: MailOpen,
  REPLIED: MessageSquareReply,
};

const STATUS_CLASSES: Record<MessageStatus, string> = {
  UNREAD: "bg-blue-100 text-blue-700",
  READ: "bg-muted text-muted-foreground",
  REPLIED: "bg-emerald-100 text-emerald-700",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | MessageStatus>("all");
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?status=${filter}`);
      const json = await res.json();
      setMessages(json.data ?? []);
      // Auto-read selected message if it matches filter
      setSelected(null);
    } catch { toast.error("Failed to load messages"); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  async function updateStatus(id: string, status: MessageStatus) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Marked as ${status.toLowerCase()}`);
      fetchMessages();
    } catch { toast.error("Failed to update"); }
  }

  async function openMessage(msg: Message) {
    setSelected(msg);
    if (msg.status === "UNREAD") await updateStatus(msg.id, "READ");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Contact form submissions.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border">
        {STATUS_OPTS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "px-4 py-2 text-sm border-b-2 -mb-px transition-colors",
              filter === value
                ? "border-foreground text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* Message list */}
        <div className="bg-background border border-border overflow-hidden">
          {loading ? (
            <div className="py-10 flex justify-center"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
          ) : messages.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No messages.</p>
          ) : (
            <ul className="divide-y divide-border">
              {messages.map((msg) => {
                const Icon = STATUS_ICONS[msg.status];
                return (
                  <li key={msg.id}>
                    <button
                      onClick={() => openMessage(msg)}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-secondary/60 transition-colors",
                        selected?.id === msg.id && "bg-secondary"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={15} className={cn("mt-0.5 shrink-0", msg.status === "UNREAD" ? "text-blue-600" : "text-muted-foreground")} />
                        <div className="min-w-0">
                          <p className={cn("text-sm truncate", msg.status === "UNREAD" ? "font-semibold" : "font-medium")}>
                            {msg.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{msg.subject ?? msg.email}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Detail pane */}
        <div className="bg-background border border-border p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-muted-foreground">Select a message to read</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-semibold">{selected.subject ?? "(No subject)"}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    From <span className="text-foreground font-medium">{selected.name}</span>{" "}
                    &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", STATUS_CLASSES[selected.status])}>
                  {selected.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border pt-6">
                {selected.message}
              </p>

              <div className="flex gap-3 pt-4 border-t border-border">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "Your message")}`}
                  onClick={() => updateStatus(selected.id, "REPLIED")}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-4 h-9 text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  <MessageSquareReply size={14} />
                  Reply via email
                </a>
                {selected.status !== "REPLIED" && (
                  <button
                    onClick={() => updateStatus(selected.id, "REPLIED")}
                    className="inline-flex items-center gap-2 border border-border px-4 h-9 text-sm hover:bg-muted transition-colors"
                  >
                    Mark as replied
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
