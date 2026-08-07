import { Skill } from "@/types/portfolio";

/**
 * Groups skills array by their category property.
 */
export function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

/**
 * Formats YYYY-MM dates into readable Month Year formats (e.g. "2022-03" to "Mar 2022").
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  if (dateString.toLowerCase() === "present") return "Present";
  
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parts[1] ? parseInt(parts[1], 10) : null;

  if (isNaN(year)) return dateString;
  if (!month || isNaN(month)) return year.toString();

  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
