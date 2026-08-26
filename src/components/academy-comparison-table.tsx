import type { AcademyMethod } from "@/lib/content";

type ComparableMethod = AcademyMethod & { comparison: NonNullable<AcademyMethod["comparison"]> };

/** Complexity has no explicit color level in the content model, so it maps to
 * the same success/warning/danger vocabulary the design system uses
 * elsewhere: higher complexity reads as more caution, not "worse". */
const complexityColor: Record<ComparableMethod["comparison"]["complexity"], "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

/**
 * Real <table> comparing only the "disponible" methods (each must carry a
 * `comparison` payload). Strategy for 375px: the table stays a real table
 * (not a card list) and scrolls horizontally inside a bordered, contained
 * wrapper (`overflow-x: auto`) rather than reflowing — this keeps the
 * <th scope="col"> semantics intact and is a deliberate choice, not an
 * accident. See `.academy-comparison-scroll` in globals.css.
 */
export function AcademyComparisonTable({
  methods,
  heading,
  caption,
  methodHeader,
  assumptionsHeader,
  complexityHeader,
  robustnessHeader,
}: {
  methods: AcademyMethod[];
  heading: string;
  caption: string;
  methodHeader: string;
  assumptionsHeader: string;
  complexityHeader: string;
  robustnessHeader: string;
}) {
  const comparable = methods.filter((method): method is ComparableMethod => Boolean(method.comparison));

  if (comparable.length === 0) return null;

  return (
    <section className="academy-comparison" aria-labelledby="academy-comparison-heading">
      <h2 id="academy-comparison-heading" className="type-h2">
        {heading}
      </h2>
      <div className="academy-comparison-scroll">
        <table className="academy-comparison-table">
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{methodHeader}</th>
              <th scope="col">{assumptionsHeader}</th>
              <th scope="col">{complexityHeader}</th>
              <th scope="col">{robustnessHeader}</th>
            </tr>
          </thead>
          <tbody>
            {comparable.map((method) => (
              <tr key={method.id}>
                <th scope="row">{method.name}</th>
                <td>
                  <ul className="academy-comparison-assumptions">
                    {method.comparison.assumptions.map((assumption) => (
                      <li key={assumption}>{assumption}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <span className={`academy-comparison-pill academy-comparison-pill--${complexityColor[method.comparison.complexity]}`}>
                    {method.comparison.complexityLabel}
                  </span>
                </td>
                <td>
                  <span className={`academy-comparison-pill academy-comparison-pill--${method.comparison.robustnessLevel}`}>
                    {method.comparison.robustnessLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
