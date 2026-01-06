export const days = [
  { id: 'mo', name: 'Понедельник' },
  { id: 'tu', name: 'Вторник' },
  { id: 'we', name: 'Среда' },
  { id: 'th', name: 'Четверг' },
  { id: 'fr', name: 'Пятница' },
  { id: 'sa', name: 'Суббота' },
  { id: 'su', name: 'Воскресенье' }
] as const;

export type DayId = typeof days[number]['id'];