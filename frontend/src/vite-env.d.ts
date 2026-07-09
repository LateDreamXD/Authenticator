/// <reference types="vite/client" />
import * as Runtime from '../wailsjs/runtime/runtime';

declare global {
	const __VERSION__: string;
	const runtime: typeof Runtime;
	interface Window {
		readonly runtime: typeof Runtime;
	}
}
