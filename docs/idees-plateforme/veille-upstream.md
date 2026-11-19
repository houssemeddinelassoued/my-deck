# Veille du dépôt officiel open-slide

> Généré le 2026-11-07 par `node scripts/veille-upstream.mjs`. Miroir : `../open-slide-upstream` (hors du projet).
> Le projet n'est pas modifié : `node_modules`, `package.json` et le patch sont seulement lus.

- Version épinglée ici : **2.0.1** (patchée localement)
- Dernière version publiée : **2.3.1**
- Versions plus récentes : 2.3.1, 2.3.0, 2.2.0, 2.1.0

## Nouveautés publiées depuis 2.0.1

### 2.3.1

- #574 Ship the agent modules the app imports so `open-slide dev` no longer fails to resolve `agent/types`, and stop publishing test files.

### 2.3.0

- #567 Add an in-app agent panel that uses a locally installed Claude Code or Codex to draft decks, apply comments, and edit pages.
- #559 Keep letterbox bars black in present mode when the screen isn't 16:9.

### 2.2.0

- #556 Move comments into a toolbar comment mode: click an element or drag across a region, write the note in a floating composer, and see every pending comment as a numbered pin beside its target.

### 2.1.0

- #546 Add a dev-only `/s/<id>/preview?p=N` route that renders a single page without editor chrome, and teach the built-in skills to screenshot it for a quick visual check.
- #524 Add a Spanish (Español) translation of the UI to the language switcher.
- #512 Navigate between focused slide thumbnails with the arrow keys.
- #544 Keep slide toolbar titles and actions accessible in narrow windows.
- #548 Refresh the favicon and sidebar logo with the new open-slide mark.
- #539 Duplicating a slide no longer creates a second folder whose name differs only by letter case.
- #522 Undo and redo now jump back to the page where the edit was made and select the changed element, and the undo/redo buttons show their keyboard shortcuts.

## Pas encore publié (branche main, hors dépendances)

- 2f7edd0 fix(core): left-align slide text in the mobile thumbnail strip (#599)
- f0a9cf9 docs: rewrite README to be shorter and current (#601)
- 1ce6bd5 ci: check the changelog page in its own job (#591)
- d12e3e1 feat(core): offer New deck before an agent is connected (#588)
- 557b56e feat(core): fade present mode in and out, nudge past the last slide (#589)
- 82349cf feat(web): point hero badge at the agent panel docs (#586)
- 02b200b chore: keep the changelog page in step with releases (#581)
- c673305 chore: add ui-screenshots project skill (#580)
- 5ee619a feat(web): hand-written changelog timeline (#579)
- a42008f docs(web): add framed UI screenshots and describe comment mode (#578)

## Compatibilité de notre patch

Patch `open-slide-core-2.0.1-folders.patch` testé sur **2.3.1** :

- ✅ s'appliquent proprement : **18** fichiers
- ⚠️ en conflit : **9** fichiers
  - `src/app/app.tsx (2 bloc·s)`
  - `src/app/routes/home.tsx (2 bloc·s)`
  - `src/app/routes/presenter.tsx (2 bloc·s)`
  - `src/app/routes/slide.tsx (4 bloc·s)`
  - `src/locale/en.ts (1 bloc·s)`
  - `src/locale/ja.ts (1 bloc·s)`
  - `src/locale/types.ts (1 bloc·s)`
  - `src/locale/zh-cn.ts (1 bloc·s)`
  - `src/locale/zh-tw.ts (1 bloc·s)`
- ❌ fichiers absents dans la nouvelle version : **2**
  - `dist/config-GMR1QUlM.d.ts`
  - `dist/config-hT1o6Jct.js`
