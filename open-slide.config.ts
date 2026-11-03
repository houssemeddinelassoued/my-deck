import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  // Folder password protection — added by patches/open-slide-core-2.0.1-folders.patch.
  // Pre-filled when you pick "Protect with password…" on a folder.
  folderLock: {
    defaultPassword: '0999',
  },
  // Site-wide password gate — added by patches/open-slide-core-2.0.1-folders.patch.
  // Every route requires this password except read-only share links (/v/<code>).
  siteLock: {
    password: '0999',
  },
};

export default openSlideConfig;
