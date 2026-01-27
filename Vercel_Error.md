22:08:45.182 Running build in Washington, D.C., USA (East) – iad1
22:08:45.186 Build machine configuration: 2 cores, 8 GB
22:08:45.443 Cloning github.com/OnePieceMonkey/Labrechner (Branch: main, Commit: 02a5df7)
22:08:46.354 Cloning completed: 911.000ms
22:08:47.576 Restored build cache from previous deployment (8T9UX3KQYATLJuvd8WS915EiMVta)
22:08:47.918 Running "vercel build"
22:08:48.842 Vercel CLI 50.5.2
22:08:49.117 Installing dependencies...
22:08:50.273 
22:08:50.274 up to date in 922ms
22:08:50.274 
22:08:50.275 166 packages are looking for funding
22:08:50.275   run `npm fund` for details
22:08:50.304 Detected Next.js version: 16.1.3
22:08:50.305 Running "npm run build"
22:08:50.401 
22:08:50.402 > labrechner@0.1.0 build
22:08:50.402 > next build
22:08:50.402 
22:08:51.198 ▲ Next.js 16.1.3 (Turbopack)
22:08:51.199 
22:08:51.233   Creating an optimized production build ...
22:09:05.853 
22:09:05.853 > Build error occurred
22:09:05.856 Error: Turbopack build failed with 1 errors:
22:09:05.856 ./src/components/dashboard/InvoicesView.tsx:218:8
22:09:05.857 Parsing ecmascript source code failed
22:09:05.857 [0m [90m 216 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-2xl font-bold text-brand-600"[39m[33m>[39m{formatCurrency(stats[33m.[39mthisMonthTotal)}[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:09:05.858  [90m 217 |[39m         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:09:05.858 [31m[1m>[22m[39m[90m 218 |[39m       )}
22:09:05.859  [90m     |[39m        [31m[1m^[22m[39m
22:09:05.859  [90m 219 |[39m         [33m<[39m[33mdiv[39m className[33m=[39m[32m"bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"[39m[33m>[39m
22:09:05.859  [90m 220 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-sm text-gray-500 dark:text-gray-400"[39m[33m>[39m[33mOffen[39m[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:09:05.860  [90m 221 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-2xl font-bold text-orange-500"[39m[33m>[39m{formatCurrency(stats[33m.[39mpendingTotal)}[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
22:09:05.860 
22:09:05.860 Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
22:09:05.861 
22:09:05.861 Import traces:
22:09:05.861   Client Component Browser:
22:09:05.861     ./src/components/dashboard/InvoicesView.tsx [Client Component Browser]
22:09:05.862     ./src/app/(app)/dashboard/page.tsx [Client Component Browser]
22:09:05.862     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:09:05.862 
22:09:05.862   Client Component SSR:
22:09:05.862     ./src/components/dashboard/InvoicesView.tsx [Client Component SSR]
22:09:05.862     ./src/app/(app)/dashboard/page.tsx [Client Component SSR]
22:09:05.862     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:09:05.863 
22:09:05.863 
22:09:05.863     at <unknown> (./src/components/dashboard/InvoicesView.tsx:218:8)
22:09:05.914 Error: Command "npm run build" exited with 1