22:18:31.842 Running build in Washington, D.C., USA (East) – iad1
22:18:31.843 Build machine configuration: 2 cores, 8 GB
22:18:31.960 Cloning github.com/OnePieceMonkey/Labrechner (Branch: main, Commit: e3dc031)
22:18:32.910 Cloning completed: 950.000ms
22:18:33.304 Restored build cache from previous deployment (8T9UX3KQYATLJuvd8WS915EiMVta)
22:18:33.659 Running "vercel build"
22:18:34.884 Vercel CLI 50.5.2
22:18:35.240 Installing dependencies...
22:18:37.595 
22:18:37.596 up to date in 2s
22:18:37.596 
22:18:37.596 166 packages are looking for funding
22:18:37.596   run `npm fund` for details
22:18:37.627 Detected Next.js version: 16.1.3
22:18:37.627 Running "npm run build"
22:18:37.725 
22:18:37.725 > labrechner@0.1.0 build
22:18:37.725 > next build
22:18:37.725 
22:18:38.527 ▲ Next.js 16.1.3 (Turbopack)
22:18:38.527 
22:18:38.561   Creating an optimized production build ...
22:18:54.318 ✓ Compiled successfully in 15.4s
22:18:54.321   Running TypeScript ...
22:19:02.334 Failed to compile.
22:19:02.334 
22:19:02.334 ./src/app/(app)/dashboard/page.tsx:686:11
22:19:02.335 Type error: Type '(invoice: InvoiceWithItems, items: InvoiceItem[]) => Promise<void>' is not assignable to type '(invoice: { id: string; user_id: string; invoice_number: string; patient_name: string | null; client_id: string | null; client_snapshot: Json; lab_snapshot: Json; kzv_id: number | null; ... 19 more ...; paid_at: string | null; }, items: { ...; }[]) => void'.
22:19:02.335   Types of parameters 'invoice' and 'invoice' are incompatible.
22:19:02.335     Property 'items' is missing in type '{ id: string; user_id: string; invoice_number: string; patient_name: string | null; client_id: string | null; client_snapshot: Json; lab_snapshot: Json; kzv_id: number | null; ... 19 more ...; paid_at: string | null; }' but required in type 'InvoiceWithItems'.
22:19:02.335 
22:19:02.335 [0m [90m 684 |[39m           onDeleteInvoice[33m=[39m{deleteInvoice}
22:19:02.335  [90m 685 |[39m           onDownloadPDF[33m=[39m{downloadPDF}
22:19:02.335 [31m[1m>[22m[39m[90m 686 |[39m           onOpenPreview[33m=[39m{openInvoicePreview}
22:19:02.335  [90m     |[39m           [31m[1m^[22m[39m
22:19:02.335  [90m 687 |[39m           onRequestPreviewUrl[33m=[39m{requestInvoicePreviewUrl}
22:19:02.336  [90m 688 |[39m           onStatusChange[33m=[39m{setInvoiceStatus}
22:19:02.336  [90m 689 |[39m         [33m/[39m[33m>[39m[0m
22:19:02.380 Next.js build worker exited with code: 1 and signal: null
22:19:02.419 Error: Command "npm run build" exited with 1