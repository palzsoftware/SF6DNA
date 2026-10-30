import { listCharacters } from '@/lib/characters';
import ConsultationRunner from './runner';
import { consultationCatalogForEnvironment } from '@/lib/consultation-card-catalog';

export default async function CharacterConsultationPage() {
  const characters = await listCharacters();
  if (!characters.length) return <main className="site-shell page-stack"><h1>キャラ別お悩み診断</h1><p role="status">キャラクター一覧を取得できませんでした。時間をおいてお試しください。</p></main>;
  const catalog = consultationCatalogForEnvironment(process.env.VERCEL_ENV ?? process.env.NODE_ENV);
  return <ConsultationRunner characters={characters.map(({ slug, name }) => ({ slug, name }))} catalog={catalog} />;
}
