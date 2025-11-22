import hallBg from './images/backgrounds/hall.png';
import labBg from './images/backgrounds/lab.png';
import securityRoomBg from './images/backgrounds/securityRoom.png';
import basementBg from './images/backgrounds/sotano.png';

const backgrounds = {
  hall: hallBg,
  vestibulo: hallBg,
  'vestibulo-principal': hallBg,
  lab: labBg,
  laboratorio: labBg,
  'security-room': securityRoomBg,
  security: securityRoomBg,
  'cuarto-de-seguridad': securityRoomBg,
  basement: basementBg,
  sotano: basementBg,
};

const characters = {};
const evidence = {};

function normalizeKey(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveFrom(map, key, type) {
  if (!key) return null;
  const normalized = normalizeKey(key);
  const src = map[normalized];
  if (!src) return null;
  return { src, alt: `${type} ${key}`.trim(), key: normalized, type };
}

function resolveAsset(key, type) {
  if (!key) return null;
  if (type === 'character') return resolveFrom(characters, key, type);
  if (type === 'evidence') return resolveFrom(evidence, key, type);
  return resolveFrom(backgrounds, key, type || 'background');
}

function buildOverlay(entry, fallbackType = 'overlay', fallbackSlot = 'center', index = 0) {
  if (!entry) return null;
  const config = typeof entry === 'string' ? { key: entry } : entry;
  const type = config.type || fallbackType || 'overlay';
  const slot = config.slot || config.align || fallbackSlot || 'center';
  const resolved = resolveAsset(config.key || config.name, type);
  const label = config.label || config.key || config.name || type;

  return {
    id: config.id || `${type}-${slot}-${index}`,
    type,
    slot,
    zIndex: config.zIndex ?? (type === 'evidence' ? 3 : 2),
    src: resolved?.src || config.src || null,
    alt: resolved?.alt || config.alt || label,
    label,
  };
}

function collectOverlays(art) {
  const overlays = [];
  if (art.character) overlays.push(buildOverlay(art.character, 'character', 'left', overlays.length));
  if (art.evidence) overlays.push(buildOverlay(art.evidence, 'evidence', 'right', overlays.length));

  if (Array.isArray(art.overlays)) {
    art.overlays.forEach((ov, idx) => {
      const overlay = buildOverlay(ov, ov?.type || 'overlay', ov?.slot, overlays.length + idx);
      if (overlay) overlays.push(overlay);
    });
  }
  return overlays.filter(Boolean);
}

export function getSceneArt(scene) {
  if (!scene) return { background: null, overlays: [] };

  const art = scene.art || {};
  const locationBackgroundKey = normalizeKey(scene.location || '');
  const backgroundKey = art.background || art.backdrop || locationBackgroundKey || null;
  const background = resolveAsset(backgroundKey, 'background');

  return {
    background,
    overlays: collectOverlays(art),
  };
}
