# Evaluations: Progressive Stratification Tensions & Patterns

Product strategy evaluations for the design tensions and alternative patterns identified in [Progressive Stratification](../progressive-stratification.md) Part 2. Each evaluation assesses fit against VariScout's philosophy, personas, and competitive positioning.

---

## Summary Matrix

### Tensions

| Tension                                                  | Strategic Weight | Primary Personas Affected | Key Insight                                                                                                      |
| -------------------------------------------------------- | ---------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Hierarchy Assumption](tensions/hierarchy-assumption.md) | **High**         | Gary, Olivia              | Interaction effects are common in real processes; the one-factor drill-down may miss them.                       |
| [Discoverability](tensions/discoverability.md)           | **High**         | Gary, Carlos              | The drill-down is both the primary differentiator and the hardest feature to find.                               |
| [Factor Ordering](tensions/factor-ordering.md)           | **Medium**       | Gary, Sara                | Analysts may not read eta-squared as navigation guidance without explicit prompting.                             |
| [When to Stop](tensions/when-to-stop.md)                 | **Medium**       | Sara, Olivia              | Statistical isolation doesn't guarantee operational actionability.                                               |
| [Mobile Screen Budget](tensions/mobile-screen-budget.md) | **Medium**       | Sara, Carlos              | Filter state and chart content compete for limited mobile viewport.                                              |
| [Path Dependency](tensions/path-dependency.md)           | **Low**          | Sara                      | Intermediate numbers differ by drill order, but final results converge. Correct behavior, potentially confusing. |

### Patterns

| Pattern                                                          | Verdict    | Tensions Addressed                                     | Philosophy Fit                   |
| ---------------------------------------------------------------- | ---------- | ------------------------------------------------------ | -------------------------------- |
| [Factor Suggestion](patterns/factor-suggestion.md)               | **Pursue** | Factor Ordering, Discoverability, When to Stop         | Good (if optional/subtle)        |
| [Interaction Heatmap](patterns/interaction-heatmap.md)           | **Pursue** | Hierarchy Assumption, Factor Ordering                  | Strong                           |
| [Parallel Path Comparison](patterns/parallel-path-comparison.md) | **Defer**  | Path Dependency, Hierarchy Assumption                  | Good                             |
| [Auto-Combination Finder](patterns/auto-combination-finder.md)   | **Defer**  | Hierarchy Assumption, Factor Ordering, Path Dependency | Mixed (conflicts with pedagogy)  |
| [Small Multiples](patterns/small-multiples.md)                   | **Defer**  | Factor Ordering, Path Dependency                       | Good (scaling limits)            |
| [Factor Map](patterns/factor-map.md)                             | **Defer**  | All 5 non-mobile tensions                              | Strong (high complexity)         |
| [Sidebar Filter Panel](patterns/sidebar-filter-panel.md)         | **Reject** | Discoverability                                        | Poor (undermines differentiator) |

---

## Crosswalk: Which Patterns Address Which Tensions

|                          | Factor Suggestion | Interaction Heatmap | Parallel Path | Auto-Combination | Small Multiples | Factor Map  | Sidebar Panel |
| ------------------------ | ----------------- | ------------------- | ------------- | ---------------- | --------------- | ----------- | ------------- |
| **Hierarchy Assumption** |                   | **primary**         | secondary     | **primary**      |                 | **primary** |               |
| **Discoverability**      | secondary         |                     |               |                  |                 | secondary   | **primary**   |
| **Factor Ordering**      | **primary**       | secondary           |               | **primary**      | partial         | **primary** |               |
| **When to Stop**         | secondary         |                     |               |                  |                 |             |               |
| **Mobile Screen Budget** |                   |                     |               |                  | worsens         | improves    | worsens       |
| **Path Dependency**      |                   |                     | **primary**   | **primary**      | partial         | **primary** |               |

**Legend**: **primary** = directly resolves the tension. secondary = partially addresses. partial = helps for some cases. worsens = makes the tension worse.

---

## Recommended Sequence

Based on the evaluations, the suggested implementation sequence is:

1. **Phase 1: Factor Suggestion** --- Low complexity, addresses the most common pain point (factor ordering), improves discoverability as a side effect. Establishes the "guided drill-down" pattern.
2. **Phase 2: Interaction Heatmap** --- Moderate complexity, addresses the highest-weight tension (hierarchy assumption). Builds on the regression engine already in `@variscout/core`.
3. **Phase 3 (future): Factor Map / Small Multiples / Parallel Path Comparison** --- Higher complexity, addresses secondary tensions. Factor map is the most ambitious but addresses the most tensions simultaneously.

The sidebar filter panel is rejected as incompatible with VariScout's core differentiator. The auto-combination finder is deferred to the Azure App only, as it conflicts with the PWA's educational mission.

---

## Methodology

Each evaluation uses a consistent template:

- **Tension files**: The tension described, persona impact assessment (6 personas), current mitigation, strategic weight, and related patterns.
- **Pattern files**: The concept described, tensions addressed, philosophy alignment (EDA, Sock Mystery, Four Lenses, Two Voices), persona impact, platform fit (PWA/Azure/Excel), competitive landscape, and strategic verdict.

Content is seeded from [Progressive Stratification](../progressive-stratification.md) Part 2 and expanded with assessments drawn from [persona definitions](../../02-journeys/personas/) and [product philosophy](../philosophy.md).

---

## Competitive Intelligence

| Document                                                | Summary                                                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [EDAScout Benchmark](competitive/edascout-benchmark.md) | Technical assessment of EDAScout v4/v6/v7/v9 --- architecture, statistics quality, AI rollback arc, and strategic implications. Based on direct codebase analysis. |
| [Minitab Benchmark](competitive/minitab-benchmark.md)   | Industry-standard desktop SPC tool (~$1,700/year). Deep feature set, menu-driven workflow, no linked filtering or progressive drill-down.                          |
| [JMP Benchmark](competitive/jmp-benchmark.md)           | SAS visual analytics platform ($1,785+/year). Strongest EDA heritage (Graph Builder), but model-first for factor analysis. Closest philosophical competitor.       |
| [Tableau Benchmark](competitive/tableau-benchmark.md)   | Dominant BI platform ($75/user/month). Defines the sidebar filter paradigm VariScout rejects. No SPC capabilities.                                                 |
| [Power BI Benchmark](competitive/powerbi-benchmark.md)  | Microsoft enterprise BI ($10/user/month). Slicer paradigm, no native SPC. Key Influencers visual provides ML-based factor ranking.                                 |
| [Minor Competitors](competitive/minor-competitors.md)   | Brief profiles of SigmaXL (Excel add-in, stepwise regression) and Looker (Google BI, filter bar pattern).                                                          |

EDAScout is the closest conceptual competitor to VariScout (browser-based variation analysis for quality professionals). The EDAScout benchmark is based on direct codebase analysis across four versions and maps findings to the tension/pattern framework above. Key takeaways: EDAScout's AI guidance was added in v6, completely rolled back in v7, and restored in v9 --- validating VariScout's methodology-driven approach. Their statistical implementation has critical flaws (hardcoded p-value buckets, misleading within-group SS metric) that VariScout's correct eta-squared and proper F-distribution calculations avoid.

The four major competitor benchmarks (Minitab, JMP, Tableau, Power BI) are based on public documentation and published feature sets, not codebase analysis. Each document maps the competitor's capabilities to VariScout's 6 tension framework and identifies strategic differentiation points. The consistent finding across all competitors: no tool combines linked filtering, progressive stratification, and statistical variation quantification into a unified investigation workflow.
