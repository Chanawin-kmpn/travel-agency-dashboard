import * as Sentry from '@sentry/react-router';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
	dsn: 'https://376dd6864729fc73f836fc729c506748@o4507690306371584.ingest.us.sentry.io/4509291158044672',

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0, // Capture 100% of the transactions
	profilesSampleRate: 1.0, // profile every transaction
});
