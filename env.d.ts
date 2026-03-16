/// <reference types="vite/client" />
/// <reference types="@latedream/niva-types/next" />

declare global {
	interface Window {
		readonly BUILD_INFO: {
			commit: string | null;
			version: string;
			isClient: boolean;
			date: string;
		}
	}
	const BUILD_INFO: Window['BUILD_INFO'];
}

export {};
