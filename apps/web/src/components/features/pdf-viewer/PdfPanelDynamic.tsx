import dynamic from 'next/dynamic';

const PdfPanel = dynamic(
  () => import('./PdfPanel').then((mod) => mod.PdfPanel),
  { ssr: false },
);

export function PdfPanelDynamic() {
  return <PdfPanel />;
}
