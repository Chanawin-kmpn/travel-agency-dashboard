import { reactRouter } from '@react-router/dev/vite';
import {
	sentryReactRouter,
	type SentryReactRouterBuildOptions,
} from '@sentry/react-router';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const sentryConfig: SentryReactRouterBuildOptions = {
	org: 'chanawin',
	project: 'travel-agency',
	// An auth token is required for uploading source maps.
	authToken:
		'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',
	// ...
};

export default defineConfig((config) => {
	return {
		plugins: [
			tailwindcss(),
			reactRouter(),
			sentryReactRouter(sentryConfig, config),
			tsconfigPaths(),
		],
		ssr: {
			noExternal: [/@syncfusion/],
		},
	};
});
