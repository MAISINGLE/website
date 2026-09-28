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

The website chat uses Gemini with verified, runtime-provided studio facts and relevant portfolio descriptions; this grounds answers in the site's current collections, policies, and image studies without fine-tuning model weights. Portfolio references are identified as illustrative stock previews, never client work. The assistant falls back to the built-in studio FAQ if no Gemini key is configured or the model is unavailable. It avoids promising date availability or inventing prices.

The private studio dashboard also has an **AI design review** action. It sends site structure, collection details, and aggregate inquiry counts to Gemini for prioritized professional-design recommendations. It does not send customer names, email addresses, dates, messages, venues, or private notes. This is context-based analysis, not model fine-tuning; `GEMINI_API_KEY` must be configured for either Gemini feature.

To enable Gemini, create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey), then from this project folder run:

```sh
npx wrangler secret put GEMINI_API_KEY
```

Paste the key only into Wrangler's terminal prompt, then deploy the Worker with `npx wrangler deploy`. Never put the key in frontend code or chat.

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
