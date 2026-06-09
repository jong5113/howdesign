type PortfolioDisplayItem = {
  title: string;
  slug: string;
  subtitle?: string;
  location?: string;
  area?: string;
  scope?: string;
  duration?: string;
  year?: number;
  description?: string;
};

export function getEnglishProjectName(item: PortfolioDisplayItem) {
  const subtitle = item.subtitle?.trim();

  if (subtitle) {
    return subtitle.toUpperCase();
  }

  return item.slug
    .split("-")
    .filter(Boolean)
    .join(" ")
    .toUpperCase();
}

export function getProjectTitleLine(item: PortfolioDisplayItem) {
  const englishTitle = getEnglishProjectName(item);
  return englishTitle === item.title ? item.title : `${englishTitle} / ${item.title}`;
}

export function getSiteLine(item: PortfolioDisplayItem) {
  return item.location ? `Site. ${item.location}` : null;
}

export function getAreaLine(item: PortfolioDisplayItem) {
  return item.area ? `Area. ${item.area}` : null;
}

export function getDetailInfoRows(item: PortfolioDisplayItem) {
  return [
    {
      label: "DESCRIPTION",
      value: item.description || item.title,
    },
    {
      label: "INTERIOR SURFACE",
      value: item.area,
    },
    {
      label: "LOCATION",
      value: item.location,
    },
    {
      label: "DATE OF COMPLETION",
      value: item.year ? String(item.year) : "",
    },
  ].filter((row) => Boolean(row.value));
}
