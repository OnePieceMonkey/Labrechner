22:11:32.618 Running build in Washington, D.C., USA (East) – iad1
22:11:32.619 Build machine configuration: 2 cores, 8 GB
22:11:32.938 Cloning github.com/OnePieceMonkey/Labrechner (Branch: main, Commit: 44c764b)
22:11:34.128 Cloning completed: 1.190s
22:11:34.834 Restored build cache from previous deployment (8T9UX3KQYATLJuvd8WS915EiMVta)
22:11:35.168 Running "vercel build"
22:11:36.078 Vercel CLI 50.5.2
22:11:36.428 Installing dependencies...
22:11:37.783 
22:11:37.784 up to date in 999ms
22:11:37.784 
22:11:37.785 166 packages are looking for funding
22:11:37.785   run `npm fund` for details
22:11:37.816 Detected Next.js version: 16.1.3
22:11:37.816 Running "npm run build"
22:11:37.917 
22:11:37.917 > labrechner@0.1.0 build
22:11:37.917 > next build
22:11:37.917 
22:11:38.904 ▲ Next.js 16.1.3 (Turbopack)
22:11:38.905 
22:11:39.088   Creating an optimized production build ...
22:11:55.725 
22:11:55.725 > Build error occurred
22:11:55.728 Error: Turbopack build failed with 1 errors:
22:11:55.728 ./src/components/dashboard/InvoicesView.tsx:438:7
22:11:55.728 Parsing ecmascript source code failed
22:11:55.728 [0m [90m 436 |[39m           })}
22:11:55.729  [90m 437 |[39m         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
22:11:55.729 [31m[1m>[22m[39m[90m 438 |[39m       {[90m/* Click outside handler */[39m}
22:11:55.729  [90m     |[39m       [31m[1m^[22m[39m
22:11:55.729  [90m 439 |[39m       {showStatusMenu [33m&&[39m (
22:11:55.729  [90m 440 |[39m         [33m<[39m[33mdiv[39m className[33m=[39m[32m"fixed inset-0 z-0"[39m onClick[33m=[39m{() [33m=>[39m setShowStatusMenu([36mnull[39m)} [33m/[39m[33m>[39m
22:11:55.729  [90m 441 |[39m       )}[0m
22:11:55.729 
22:11:55.729 Expected '</', got '{'
22:11:55.729 
22:11:55.729 Import traces:
22:11:55.729   Client Component Browser:
22:11:55.730     ./src/components/dashboard/InvoicesView.tsx [Client Component Browser]
22:11:55.730     ./src/app/(app)/dashboard/page.tsx [Client Component Browser]
22:11:55.730     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:11:55.730 
22:11:55.730   Client Component SSR:
22:11:55.730     ./src/components/dashboard/InvoicesView.tsx [Client Component SSR]
22:11:55.730     ./src/app/(app)/dashboard/page.tsx [Client Component SSR]
22:11:55.730     ./src/app/(app)/dashboard/page.tsx [Server Component]
22:11:55.730 
22:11:55.731 
22:11:55.731     at <unknown> (./src/components/dashboard/InvoicesView.tsx:438:7)
22:11:55.786 Error: Command "npm run build" exited with 1