import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

const readers = [
  { name: "NVDA", url: "https://www.nvaccess.org/", free: "Free" },
  { name: "JAWS", url: "https://www.freedomscientific.com/products/software/jaws/", free: "Commercial" },
  { name: "Narrator (Windows)", url: "https://support.microsoft.com/", free: "Free (built-in)" },
  { name: "VoiceOver (macOS / iOS)", url: "https://www.apple.com/accessibility/", free: "Free (built-in)" },
  { name: "TalkBack (Android)", url: "https://support.google.com/accessibility/android", free: "Free (built-in)" },
  { name: "ChromeVox", url: "https://chrome.google.com/", free: "Free" },
];

const shortcuts = [
  ["Tab / Shift + Tab", "Navigate forward / backward through interactive elements"],
  ["Enter / Space", "Activate the focused link or button"],
  ["Arrow Keys", "Navigate within menus and lists"],
  ["Esc", "Close modal dialogs / dropdowns"],
  ["Alt + 1", "Skip to main content"],
];

export default function ScreenReader() {
  return (
    <PageLayout>
      <PageHeader title="Screen Reader Access" subtitle="Information about screen readers supported on the ELEMENT portal." breadcrumb={["Home", "Screen Reader Access"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl space-y-8">
          <p className="text-sm text-foreground/80 leading-relaxed">
            The ELEMENT portal complies with accessibility standards and is designed to work with most popular screen readers used by visually impaired users.
          </p>

          <div>
            <h2 className="text-lg font-bold text-primary mb-3">Supported Screen Readers</h2>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="data-table">
                <thead><tr><th>Screen Reader</th><th>Website</th><th>Type</th></tr></thead>
                <tbody>
                  {readers.map(r => (
                    <tr key={r.name}>
                      <td className="font-medium">{r.name}</td>
                      <td><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{r.url}</a></td>
                      <td>{r.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary mb-3">Keyboard Shortcuts</h2>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="data-table">
                <thead><tr><th>Key</th><th>Action</th></tr></thead>
                <tbody>
                  {shortcuts.map(([k, a]) => (
                    <tr key={k}><td className="font-mono font-semibold">{k}</td><td>{a}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface border-l-4 border-accent p-5 rounded-r-md">
            <h3 className="text-base font-semibold text-primary mb-2">Compatibility</h3>
            <p className="text-sm text-foreground/80">The portal is tested with the latest versions of Chrome, Firefox, Edge and Safari. For best accessibility experience, please keep your browser and screen reader software up to date.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
