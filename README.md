# React + TypeScript + Vite

## Studio inquiries and reservations

The public form stores booking inquiries in the `olive-lane-bookings` D1 database. A submitted inquiry is not a confirmed reservation; review it and mark it booked in the private studio dashboard at `/#admin` after configuring access below.

### Secure studio dashboard

Set these Wrangler secrets for the production Worker. Enter each value at the prompt; do not put secrets in this repository or paste them into chat.

```sh
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOTP_SECRET
npx wrangler secret put ADMIN_TOKEN_SECRET
```

`ADMIN_TOTP_SECRET` must be a Base32 secret entered into an authenticator app. Generate one locally with:

```sh
python3 -c "import base64,secrets; print(base64.b32encode(secrets.token_bytes(20)).decode().rstrip('='))"
```

`ADMIN_TOKEN_SECRET` should be a separate, long random value. For example, generate one locally with `openssl rand -hex 32`. Sign-in requires the password and a current six-digit authenticator code. Dashboard sessions expire after 12 hours; sign-in is rate limited by Cloudflare.

### Inquiry notification tracking

Apply the D1 migration before deploying the Worker so inquiry notification attempts, Resend response IDs, and redacted failure details can be recorded:

```sh
npx wrangler d1 migrations apply olive-lane-bookings --remote
```

Delivery status and retry controls are available only in the authenticated studio dashboard. A successful Resend API response means the message was accepted by Resend; final inbox delivery is controlled by the email provider.

### Inquiry email alerts

Email alerts use the Resend API. Configure all three values as Wrangler secrets after verifying a sending domain with your email provider:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_FROM
npx wrangler secret put INQUIRY_NOTIFICATION_EMAIL
```

`EMAIL_FROM` must be an address on the verified sending domain. `INQUIRY_NOTIFICATION_EMAIL` is the inbox that receives new inquiry details. The form continues to save inquiries to D1 if email delivery is not configured or temporarily fails.

Set `INQUIRY_NOTIFICATION_EMAIL` to the studio inbox that should receive new inquiry alerts. From the project folder, run:

```sh
npx wrangler secret put INQUIRY_NOTIFICATION_EMAIL
```

When Wrangler prompts for the value, enter the desired studio inbox and press Enter. This changes the recipient immediately on the deployed Worker. Repeat the command any time you want to change the notification inbox. Keep API keys private and enter them only at Wrangler's prompt.

### Website AI assistant

The customer chat uses the public `/api/studio-knowledge` endpoint as its source of truth for the studio profile and FAQs. The Worker retrieves relevant FAQs and current collection details using the current question plus recent user turns, then sends that grounded context and conversation to Google's Gemini API using `gemini-2.5-flash`; this is context-based answering, not fine-tuning. Google's current Gemini API pricing page lists a free tier with limited model access and quotas; requests can be rate-limited, and free-tier content may be used to improve Google products. Do not send sensitive personal or payment information. Replies include links to relevant site sections, and built-in FAQ answers remain available if Gemini is not configured or is unavailable. The assistant does not query inquiry rows, dashboard data, or notification secrets. Portfolio references are illustrative stock previews, never client work.

The public knowledge endpoint contains only approved business details and FAQ text. FAQ topics are grouped around common photography-customer concerns and written for Olive Lane; other businesses' FAQ answers are not copied. When Olive Lane has not published a policy (for example, RAW files, weather contingencies, or image licensing), the assistant says so and directs the customer to the studio rather than guessing. Customer inquiries are stored separately in the private D1 database and are used by the studio dashboard and email notifications. The chat must not receive or return names, email addresses, dates, messages, venues, or private notes from those records. The inquiry form does not collect payment; accepted payment options and terms must be confirmed in the written proposal. Update the curated source in `src/studio-knowledge.ts` when verified public business information changes.

The private studio dashboard also has an **AI design review** action. It sends site structure, collection details, and aggregate inquiry counts to Gemini for prioritized professional-design recommendations. It does not send customer names, email addresses, dates, messages, venues, or private notes. This is context-based analysis, not model fine-tuning; `GEMINI_API_KEY` must be configured for either AI feature.

To enable the AI features, create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey). Keep the project on the free tier and do not enable billing if you require a hard no-charge setup. Google may change free-tier availability, quotas, and terms; check its [pricing](https://ai.google.dev/gemini-api/docs/pricing) and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits). From this project folder, run:

```sh
npx wrangler secret put GEMINI_API_KEY
```

Enter the key only at Wrangler's terminal prompt, then deploy the Worker with `npx wrangler deploy`. Never put the key in frontend code, repository files, or chat. With billing disabled, requests beyond free quotas should fail rather than incur charges.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
