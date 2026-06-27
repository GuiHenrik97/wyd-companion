export enum TaskType {
  CHECKIN = 'CHECKIN',
  INFERNAL = 'INFERNAL',
  MORTAL = 'MORTAL',
  DESERTO = 'DESERTO',
  ESPOLIOS = 'ESPOLIOS',
  TORRES = 'TORRES',
  KEFRA = 'KEFRA',
  CIDADE = 'CIDADE',
}

// Tarefas que só aparecem se o personagem tem guild
export const GUILD_TASKS = [TaskType.TORRES, TaskType.KEFRA, TaskType.CIDADE]

// Dia da semana de cada tarefa de guild (0=Dom, 1=Seg... 6=Sab)
export const GUILD_TASK_DAYS: Record<string, number> = {
  [TaskType.TORRES]: -1, // Seg a Sex (1-5)
  [TaskType.KEFRA]: 6,   // Sábado
  [TaskType.CIDADE]: 0,  // Domingo
}
