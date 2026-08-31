import Link from "next/link";
import { CharacterCard } from "@/components/character-card";
import { characterDataSourceStatus, listCharacters } from "@/lib/characters";

export const metadata = {
  title: "キャラクター情報",
  description: "SF6のキャラクター情報を、技・フレーム・コンボ・セットプレイ・対策・トレーニングまで横断して確認できる辞典です。",
};

function normalizeQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim().slice(0, 80) ?? "";
}

export default async function CharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const [characters, query] = await Promise.all([
    listCharacters(),
    searchParams.then((params) => normalizeQuery(params.q)),
  ]);
  const sourceStatus = characterDataSourceStatus();
  const normalized = query.toLocaleLowerCase("ja");
  const visibleCharacters = normalized
    ? characters.filter((character) =>
        [character.name, character.nameEn]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase("ja").includes(normalized))
      )
    : characters;

  return (
    <div className="site-shell page-stack">
      <section className="hero compact-hero">
        <p className="eyebrow">CHARACTERS</p>
        <h1>キャラクター辞典</h1>
        <p>
          キャラクターを起点に、技・フレーム・コンボ・セットプレイ・対策・トレーニング・参考プレイヤーまで横断できます。
        </p>
      </section>

      <section className="character-tools" aria-label="キャラクター検索と補助機能">
        <form className="character-filter" action="/characters">
          <input
            aria-label="キャラクター名で絞り込む"
            defaultValue={query}
            name="q"
            placeholder="キャラクター名で絞り込む"
          />
          <button type="submit">絞り込む</button>
        </form>
        <div className="character-tool-links">
          <Link className="character-tool-link" href="/favorites">お気に入り</Link>
          <Link className="character-tool-link" href="/compare">キャラ比較</Link>
          <Link className="character-tool-link" href="/counters">対策</Link>
          <Link className="character-tool-link" href="/training">トレーニング</Link>
        </div>
      </section>

      {sourceStatus === "unconfigured" ? (
        <section className="data-notice" aria-live="polite">
          <strong>キャラクターデータを取得できません</strong>
          <p>現在データを読み込めません。接続状態を確認して、時間をおいて再読み込みしてください。</p>
        </section>
      ) : null}

      {characters.length > 0 ? (
        <section>
          <div className="section-heading">
            <h2>{query ? `「${query}」の検索結果` : "キャラクター一覧"}</h2>
            <p>{visibleCharacters.length} / {characters.length}キャラクター</p>
          </div>
          {query ? (
            <p className="character-filter-summary">
              名前で絞り込んでいます。
              <Link href="/characters">絞り込みを解除</Link>
            </p>
          ) : null}
          {visibleCharacters.length ? (
            <div className="character-grid">
              {visibleCharacters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>該当するキャラクターが見つかりません</h2>
              <p>名前を短くして再検索するか、一覧に戻って選択してください。</p>
              <Link className="inline-button button-secondary" href="/characters">一覧に戻る</Link>
            </div>
          )}
        </section>
      ) : (
        <section className="empty-state">
          <h2>公開データはまだありません</h2>
          <p>出典・対象パッチ・確認状態を確認できた情報から順に公開します。</p>
        </section>
      )}
    </div>
  );
}
