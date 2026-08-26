"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SiteShell } from "@/components/site-shell";
import { AcademyToc } from "@/components/academy-toc";
import { AcademyComparisonTable } from "@/components/academy-comparison-table";
import type { SiteContent } from "@/lib/content";

export function AcademyView({ content }: { content: SiteContent }) {
  const { academy } = content;
  const [activeId, setActiveId] = useState<string | null>(academy.methods[0]?.id ?? null);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const articles = academy.methods
      .map((method) => document.getElementById(method.id))
      .filter((node): node is HTMLElement => node !== null);

    if (articles.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // Prefer the entry closest to the top of the viewport so the active
        // link matches what the reader is actually looking at.
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    articles.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [academy.methods]);

  return (
    <SiteShell content={content} eyebrow={academy.eyebrow} title={academy.title} intro={academy.intro}>
      <div className="academy-reading-column">
        <Dialog.Root open={tocOpen} onOpenChange={setTocOpen}>
          <Dialog.Trigger asChild>
            <button type="button" className="academy-toc-trigger">
              {academy.tocMobileButtonLabel}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="academy-toc-dialog-overlay" />
            <Dialog.Content className="academy-toc-dialog-content">
              <div className="mobile-dialog-header">
                <Dialog.Title className="sr-only">{academy.tocMobileTitle}</Dialog.Title>
                <Dialog.Close asChild>
                  <button type="button" className="mobile-dialog-close">
                    {academy.tocMobileCloseLabel}
                  </button>
                </Dialog.Close>
              </div>
              <div className="academy-toc-mobile-body">
                <AcademyToc
                  methods={academy.methods}
                  heading={academy.tocMobileTitle}
                  comingSoonBadge={academy.comingSoonBadge}
                  activeId={activeId}
                  onNavigate={() => setTocOpen(false)}
                />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="academy-toc-desktop">
          <AcademyToc
            methods={academy.methods}
            heading={academy.tocHeading}
            comingSoonBadge={academy.comingSoonBadge}
            activeId={activeId}
          />
        </div>

        <div className="academy-methods">
          {academy.methods.map((method) => (
            <article key={method.id} id={method.id} className="academy-method">
              <div className="academy-method-heading">
                <h2 className="type-h2">{method.name}</h2>
                {method.status === "en-preparacion" && (
                  <span className="type-caption warning-bg academy-badge">{academy.comingSoonBadge}</span>
                )}
              </div>
              <p className="type-body-dense">{method.summary}</p>
              {method.body.map((block, index) =>
                block.kind === "code" ? (
                  <code key={index} className="type-code academy-code">
                    {block.text}
                  </code>
                ) : (
                  <p key={index} className="type-body-dense">
                    {block.text}
                  </p>
                ),
              )}
            </article>
          ))}

          <AcademyComparisonTable
            methods={academy.methods}
            heading={academy.comparisonTable.heading}
            caption={academy.comparisonTable.caption}
            methodHeader={academy.comparisonTable.methodHeader}
            assumptionsHeader={academy.comparisonTable.assumptionsHeader}
            complexityHeader={academy.comparisonTable.complexityHeader}
            robustnessHeader={academy.comparisonTable.robustnessHeader}
          />
        </div>
      </div>
    </SiteShell>
  );
}
