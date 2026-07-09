"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paperMatchesResults = exports.splitResultValues = exports.normalizeText = void 0;
function normalizeText(value) {
    return (value !== null && value !== void 0 ? value : "")
        .replace(/\(https?:\/\/[^)]+\)/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}
exports.normalizeText = normalizeText;
function splitResultValues(value) {
    if (!value) {
        return [];
    }
    return value
        .split(",")
        .map((v) => normalizeText(v))
        .filter(Boolean);
}
exports.splitResultValues = splitResultValues;
function paperMatchesResults(paper, resultTitles) {
    const values = [
        ...splitResultValues(paper.Results),
        ...splitResultValues(paper.RelatedToResults1),
        ...splitResultValues(paper.RelatedToResults2),
    ];
    return values.some((value) => resultTitles.has(value));
}
exports.paperMatchesResults = paperMatchesResults;
