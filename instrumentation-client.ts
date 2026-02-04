import posthog from "posthog-js"

// Ensure NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST are set in your environment variables (e.g., .env.local)
// NEXT_PUBLIC_POSTHOG_KEY should be your project API key
// NEXT_PUBLIC_POSTHOG_HOST should be the URL of your PostHog instance (e.g., https://app.posthog.com)

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://us.posthog.com", // This can usually remain as is
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: process.env.NODE_ENV === "development",
});