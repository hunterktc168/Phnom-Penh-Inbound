import { installPreviewHostBridge } from '../src/lib/preview-host-bridge';
import type { ClientInit } from '@sveltejs/kit';

// Client hook.
//
// Mounts the guest side of the platform preview bridge so the live preview
// chrome can drive navigation and back/forward inside the app. It activates
// only when the page is framed by an allowlisted Grok embedder and is a noop
// in every other context (top-level loads, local dev, deployed sites).
export const init: ClientInit = () => {
	installPreviewHostBridge();
};
