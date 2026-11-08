import { like, not, eq, type ColumnBaseConfig, type ColumnType, Column } from "drizzle-orm";

export function parseFilterCondition(
  column: Column<ColumnBaseConfig<ColumnType>, object>,
  input: string,
) {
  const negated = input.startsWith("!");
  const value = negated ? input.slice(1) : input;
  const startsWithPercent = value.startsWith("%");
  const endsWithPercent = value.endsWith("%");
  const searchValue = value.slice(startsWithPercent ? 1 : 0, endsWithPercent ? -1 : undefined);

  let condition;

  if (startsWithPercent && endsWithPercent) {
    condition = like(column, `%${searchValue}%`);
  } else if (startsWithPercent) {
    condition = like(column, `%${searchValue}`);
  } else if (endsWithPercent) {
    condition = like(column, `${searchValue}%`);
  } else {
    condition = eq(column, searchValue);
  }

  return negated ? not(condition) : condition;
}
