import { AdminCharacterForm } from "@/components/admin-character-form";
import { requireAdmin } from "@/lib/admin";
import { createCharacter } from "../actions";

export const metadata = { title: "新規キャラクター | SF6DNA" };

export default async function NewCharacterPage() {
  await requireAdmin();
  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero"><p className="eyebrow">ADMIN / CHARACTERS</p><h1>新規キャラクター</h1></section>
      <AdminCharacterForm action={createCharacter} submitLabel="作成" />
    </div>
  );
}
