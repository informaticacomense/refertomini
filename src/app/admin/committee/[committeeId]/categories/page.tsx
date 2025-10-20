"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CategoryManager({ params }: { params: { committeeId: string } }) {
  const { committeeId } = params;
  const [seasonId, setSeasonId] = useState(""); // selezionabile da dropdown in futuro
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!committeeId || !seasonId) return;
    loadCategories();
  }, [committeeId, seasonId]);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch(`/api/admin/committee/${committeeId}/categories?seasonId=${seasonId}`);
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function createCategory() {
    if (!newCategoryName.trim()) return;
    const res = await fetch(`/api/admin/committee/${committeeId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName, seasonId }),
    });
    if (res.ok) {
      setNewCategoryName("");
      setDialogOpen(false);
      loadCategories();
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Eliminare questa categoria e tutti i gironi associati?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestione Categorie e Gironi</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>➕ Nuova categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea nuova categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome categoria (es. Aquilotti)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button onClick={createCategory}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{cat.name}</CardTitle>
                <Button variant="destructive" size="sm" onClick={() => deleteCategory(cat.id)}>
                  Elimina
                </Button>
              </CardHeader>
              <CardContent>
                <GironiList category={cat} reload={loadCategories} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function GironiList({ category, reload }: { category: any; reload: () => void }) {
  const [newGroupName, setNewGroupName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  async function createGroup() {
    const res = await fetch(`/api/admin/categories/${category.id}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newGroupName,
        seasonId: category.seasonId,
        committeeId: category.committeeId,
      }),
    });
    if (res.ok) {
      setNewGroupName("");
      setDialogOpen(false);
      reload();
    }
  }

  async function deleteGroup(id: string) {
    if (!confirm("Eliminare questo girone?")) return;
    await fetch(`/api/admin/groups/${id}`, { method: "DELETE" });
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Gironi</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">➕ Aggiungi girone</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo girone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome girone (es. Girone A)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button onClick={createGroup}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-2">
        {category.groups.length === 0 && <p className="text-sm text-gray-500">Nessun girone</p>}
        {category.groups.map((g: any) => (
          <li key={g.id} className="flex justify-between border rounded p-2">
            <span>{g.name}</span>
            <Button size="sm" variant="destructive" onClick={() => deleteGroup(g.id)}>
              Elimina
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
