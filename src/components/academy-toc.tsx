import type { AcademyMethod } from "@/lib/content";

/**
 * Pure-HTML index of anchor links: works with JS disabled. Used in two
 * contexts — sticky sidebar on desktop (S-07 #2a) and inside a Radix
 * Dialog.Content for the mobile "Index" panel (S-07 #2b). `activeId` is
 * driven by an IntersectionObserver scroll-spy in the parent view and is
 * purely a progressive enhancement on top of the working anchor links.
 */
export function AcademyToc({
  methods,
  heading,
  comingSoonBadge,
  activeId,
  onNavigate,
}: {
  methods: Pick<AcademyMethod, "id" | "name" | "status">[];
  heading: string;
  comingSoonBadge: string;
  activeId?: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="academy-toc" aria-label={heading}>
      <p className="type-caption">{heading}</p>
      <ol>
        {methods.map((method) => {
          const isActive = method.id === activeId;
          return (
            <li key={method.id}>
              <a href={`#${method.id}`} aria-current={isActive ? "location" : undefined} onClick={onNavigate}>
                {method.name}
              </a>
              {method.status === "en-preparacion" && (
                <span className="type-caption warning-bg academy-badge">{comingSoonBadge}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
