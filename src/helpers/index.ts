export function normalizeText(value?: string | null): string {
  return (value ?? "")
    .replace(/\(https?:\/\/[^)]+\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function splitResultValues(value?: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((v) => normalizeText(v))
    .filter(Boolean);
}

export function paperMatchesResults(
  paper: {
    Results?: string | null;
    RelatedToResults1?: string | null;
    RelatedToResults2?: string | null;
  },
  resultTitles: Set<string>,
): boolean {
  const values = [
    ...splitResultValues(paper.Results),
    ...splitResultValues(paper.RelatedToResults1),
    ...splitResultValues(paper.RelatedToResults2),
  ];

  return values.some((value) => resultTitles.has(value));
}
