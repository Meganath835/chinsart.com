"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { artworks: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      setCategories(json.data ?? []);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Category created");
      setNewName(""); setNewDesc("");
      fetchCategories();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setAdding(false); }
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Updated");
      setEditId(null);
      fetchCategories();
    } catch { toast.error("Failed to update"); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Artworks in this category will not be deleted, just uncategorised.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Deleted");
      fetchCategories();
    } catch { toast.error("Failed to delete"); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">Organise artworks into categories.</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-background border border-border p-6 space-y-4 max-w-lg">
        <h2 className="font-medium text-sm">Add Category</h2>
        <div className="space-y-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="rounded-none"
            required
          />
          <Input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="rounded-none"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 h-9 text-sm font-medium hover:bg-foreground/90 disabled:opacity-60 disabled:pointer-events-none transition-colors"
        >
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add
        </button>
      </form>

      {/* List */}
      <div className="bg-background border border-border">
        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Name</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">Slug</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">Artworks</th>
                <th className="px-6 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3">
                    {editId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-none h-7 text-sm"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") handleRename(cat.id); if (e.key === "Escape") setEditId(null); }}
                        />
                        <button onClick={() => handleRename(cat.id)} className="text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                        <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                      </div>
                    ) : (
                      <span className="font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{cat._count?.artworks ?? 0}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="p-1.5 hover:bg-muted transition-colors" aria-label="Edit">
                        <Pencil size={13} className="text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 hover:bg-muted transition-colors" aria-label="Delete">
                        <Trash2 size={13} className="text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
