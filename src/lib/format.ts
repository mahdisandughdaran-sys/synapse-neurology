const FA = "۰۱۲۳۴۵۶۷۸۹";

export function faNum(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)] ?? d);
}
