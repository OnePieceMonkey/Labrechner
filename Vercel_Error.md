22:15:07.506 Running build in Washington, D.C., USA (East) – iad1
22:15:07.506 Build machine configuration: 2 cores, 8 GB
22:15:07.645 Cloning github.com/OnePieceMonkey/Labrechner (Branch: main, Commit: 6b3d020)
22:15:08.363 Cloning completed: 718.000ms
22:15:08.870 Restored build cache from previous deployment (8T9UX3KQYATLJuvd8WS915EiMVta)
22:15:09.286 Running "vercel build"
22:15:10.209 Vercel CLI 50.5.2
22:15:10.491 Installing dependencies...
22:15:12.862 
22:15:12.862 up to date in 2s
22:15:12.863 
22:15:12.863 166 packages are looking for funding
22:15:12.863   run `npm fund` for details
22:15:12.893 Detected Next.js version: 16.1.3
22:15:12.893 Running "npm run build"
22:15:13.001 
22:15:13.002 > labrechner@0.1.0 build
22:15:13.002 > next build
22:15:13.002 
22:15:13.817 ▲ Next.js 16.1.3 (Turbopack)
22:15:13.817 
22:15:13.851   Creating an optimized production build ...
22:15:30.469 
22:15:30.470 > Build error occurred
22:15:30.472 Error: Turbopack build failed with 1 errors:
22:15:30.472 ./src/components/dashboard/InvoicesView.tsx:218:8
22:15:30.472 Parsing ecmascript source code failed
22:15:30.473 [0m [90m 216 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-2xl font-bold text-brand-600"[39m[33m>[39m{formatCurrency(stats[33m.[39mthisMonthTotal)}[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:15:30.473  [90m 217 |[39m         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:15:30.473 [31m[1m>[22m[39m[90m 218 |[39m       )}
22:15:30.473  [90m     |[39m        [31m[1m^[22m[39m
22:15:30.473  [90m 219 |[39m         [33m<[39m[33mdiv[39m className[33m=[39m[32m"bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"[39m[33m>[39m
22:15:30.473  [90m 220 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-sm text-gray-500 dark:text-gray-400"[39m[33m>[39m[33mOffen[39m[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:15:30.473  [90m 221 |[39m           [33m<[39m[33mdiv[39m className[33m=[39m[32m"text-2xl font-bold text-orange-500"[39m[33m>[39m{formatCurrency(stats[33m.[39mpendingTotal)}[33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
22:15:30.473 
22:15:30.473 Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
22:15:30.473 
22:15:30.473 Import traces:
22:15:30.473   Client Component Browser:
22:15:30.473     ./src/components/dashboard/InvoicesView.tsx [Client Component Browser]
22:15:30.474     ./src/app/(app)/dashboard/page.tsx [Client Component Browser]
22:15:30.474     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:15:30.474 
22:15:30.474   Client Component SSR:
22:15:30.474     ./src/components/dashboard/InvoicesView.tsx [Client Component SSR]
22:15:30.474     ./src/app/(app)/dashboard/page.tsx [Client Component SSR]
22:15:30.474     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:15:30.474 
22:15:30.474 
22:15:30.474     at <unknown> (./src/components/dashboard/InvoicesView.tsx:218:8)
22:15:30.527 Error: Command "npm run build" exited with 1