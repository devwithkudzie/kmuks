This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local Google Sheets authentication

Google Sheets uses Vercel OIDC with Google Workload Identity Federation. For
local development, link this directory to the existing Vercel project:

```sh
npx vercel login
npx vercel link --project kmuks
```

Choose the team that owns the project. The installed `@vercel/oidc` needs
the ignored `.vercel/project.json` to refresh expired local tokens using
your Vercel login. Newer CLI versions may retain only `.vercel/repo.json`.
In that case, create `.vercel/project.json` from the matching project entry:
use its `id` as `projectId`, `orgId` as `orgId`, and `name` as `projectName`.
Do not commit these local metadata files.

If the dashboard reports `project.json not found`, repeat the project-link
command and reload `/admin`. If refresh reports an expired CLI login, run
`npx vercel login` again. The React DevTools and HMR messages are normal
local-development output.

See [Vercel OIDC documentation](https://vercel.com/docs/oidc) for setup details.

## "Work with me" leads and WhatsApp alerts

Every "Work with me" / contact button on the main site opens the same short form. Submissions are saved to the **Work With Me** tab of the client setup spreadsheet (created automatically), including which button was clicked (`Source`), the page, and any UTM tags.

After a lead is saved, the site sends you a WhatsApp alert through Meta's WhatsApp Cloud API. If the `WHATSAPP_*` variables are blank, alerts are skipped and leads are still saved.

Setup:

1. In [Meta for Developers](https://developers.facebook.com/), create a Business app and add the **WhatsApp** product. Register a phone number to send from (it can't be the WhatsApp number you use day to day).
2. Create a **permanent access token** for a system user in Meta Business Settings with `whatsapp_business_messaging` permission, and copy the **Phone number ID** from the WhatsApp → API Setup page.
3. In WhatsApp Manager, create a message template, category **Utility**, named e.g. `new_lead_alert`, language English, with this body, and wait for approval:

   ```
   New lead from kudziemuks.com
   Name: {{1}}
   Business: {{2}}
   WhatsApp: {{3}}
   What they do: {{4}}
   Source: {{5}}
   ```

4. Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO` (your number, digits only), `WHATSAPP_TEMPLATE_NAME` and `WHATSAPP_TEMPLATE_LANGUAGE` (the template's language code, e.g. `en` or `en_US`) in Vercel and `.env.local`.

Failed alerts are logged as `[work-with-me] WhatsApp notification failed:` with Meta's error message.
