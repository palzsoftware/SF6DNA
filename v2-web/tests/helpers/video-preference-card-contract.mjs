import assert from 'node:assert/strict';
import React from 'react';
import { makeSourceLoader } from './ws12-render-contract.mjs';

// Actual VideoCard rendering/handlers; Owner hook and persistence are stubbed.
// This does not exercise auth lifecycle, browser events or real storage.
export function assertVideoPreferenceCard(kind) {
  assert.ok(['favorite', 'watched'].includes(kind));
  let status = 'ready';
  let allowed = true;
  let changes = 0;
  const calls = [];
  const favorites = new Set();
  const watched = new Set();
  const selected = kind === 'favorite' ? favorites : watched;
  const video = { id: 'fixture-video', slug: 'fixture-video', title: 'fixture', platform: 'youtube', url: 'https://youtu.be/abcdefghijk', thumbnailUrl: null, events: [], characters: [], players: [], durationSeconds: null, videoType: null };
  const loader = makeSourceLoader({
    react: { ...React, useState: value => [value, () => {}] },
    'next/link': { default: 'a', __esModule: true },
    '@/lib/use-owned-video-preferences': { useOwnedVideoPreferences: () => ({
      status, favorites, watched, message: '', refresh: () => {},
      toggle: (requested, id) => {
        calls.push([requested, id]);
        if (!allowed || status !== 'ready') return false;
        const set = requested === 'favorite' ? favorites : watched;
        if (set.has(id)) set.delete(id); else set.add(id);
        return true;
      },
    }) },
  });
  const { VideoCard } = loader('components/video-card');
  function button() {
    const nodes = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!React.isValidElement(node)) return;
      if (node.type === 'button') nodes.push(node);
      visit(node.props.children);
    }
    visit(VideoCard({ video, publishedDate: null, onPreferenceChange: () => { changes++; } }));
    const found = nodes.find(node => kind === 'favorite'
      ? node.props['aria-label']?.includes('お気に入り')
      : String(node.props.children).includes('視聴'));
    assert.ok(found, kind + ' button exists');
    return found;
  }
  let node = button();
  assert.equal(node.props.disabled, false);
  assert.equal(node.props['aria-pressed'], false);
  node.props.onClick();
  assert.equal(button().props['aria-pressed'], true);
  assert.equal(changes, 1);
  button().props.onClick();
  assert.equal(button().props['aria-pressed'], false);
  assert.equal(changes, 2);
  assert.deepEqual(calls, [[kind, video.id], [kind, video.id]]);
  allowed = false;
  button().props.onClick();
  assert.equal(changes, 2, 'failed toggle must not signal a successful preference change');
  assert.equal(button().props['aria-pressed'], false);
  selected.add(video.id);
  for (status of ['loading', 'error']) {
    node = button();
    assert.equal(node.props.disabled, true);
    assert.equal(node.props['aria-pressed'], undefined, 'pending/error must mask a previous saved value');
  }
}
