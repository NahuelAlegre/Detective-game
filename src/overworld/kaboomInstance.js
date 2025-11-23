import kaboom from "kaboom";

let k = null;

export function initKaboom(canvas) {
  if (k) {
    try {
      k.destroy();
    } catch (err) {
      console.warn("Kaboom cleanup failed", err);
    }
    k = null;
  }

  k = kaboom({
    global: false,
    canvas,
    width: 640,
    height: 360,
    background: [10, 12, 16],
    letterbox: true,
    stretch: true,
    crisp: true,
  });
  k.setGravity(0);
  loadBaseSprites(k);
  return k;
}

export function destroyKaboom() {
  if (k) {
    try {
      k.destroy();
    } catch (err) {
      console.warn("Kaboom destroy failed", err);
    }
    k = null;
  }
}

export function getKaboom() {
  return k;
}

export function loadBaseSprites(instance) {
  if (!instance) return;
  instance.loadSprite("detective_idle", "/sprites/Adam_idle_anim_16x16.png", {
    sliceX: 24,
    anims: {
      idle_down: { from: 0, to: 5, loop: true, speed: 8 },
      idle_side: { from: 0, to: 5, loop: true, speed: 8 },
      idle_up: { from: 0, to: 5, loop: true, speed: 8 },
    },
  });
  instance.loadSprite("detective_run", "/sprites/Adam_run_16x16.png", {
    sliceX: 24,
    anims: {
      idle_down: { from: 0, to: 0, loop: true, speed: 1 },
      idle_side: { from: 6, to: 6, loop: true, speed: 1 },
      idle_up: { from: 12, to: 12, loop: true, speed: 1 },
      walk_down: { from: 0, to: 5, loop: true, speed: 10 },
      walk_side: { from: 6, to: 11, loop: true, speed: 10 },
      walk_up: { from: 12, to: 17, loop: true, speed: 10 },
    },
  });
  instance.loadSprite("tiles-room", "/sprites/Room_Builder_free_16x16.png", {
    sliceX: 17,
    sliceY: 23,
  });
  instance.loadSprite("tiles-interior", "/sprites/Interiors_free_16x16.png", {
    sliceX: 16,
    sliceY: 89,
  });
}
