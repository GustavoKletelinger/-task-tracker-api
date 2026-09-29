import { Request, Response } from 'express';
import { Task, TaskAttributes, TaskPriority, TaskStatus } from '../models/Task';

const PRIORITIES: TaskPriority[] = ['baixa', 'media', 'alta'];
const STATUSES: TaskStatus[] = ['pendente', 'em_andamento', 'concluida'];

type TaskInput = Partial<
  Pick<TaskAttributes, 'title' | 'description' | 'priority' | 'status' | 'dueDate'>
>;

interface ValidationResult {
  data: TaskInput;
  errors: string[];
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validateBody(body: unknown, requireTitle: boolean): ValidationResult {
  const data: TaskInput = {};
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    return { data, errors: ['O corpo da requisição deve ser um objeto JSON'] };
  }
  const input = body as Record<string, unknown>;

  if (input.title === undefined) {
    if (requireTitle) errors.push('O campo title é obrigatório');
  } else if (typeof input.title !== 'string' || input.title.trim() === '') {
    errors.push('O campo title deve ser um texto não vazio');
  } else if (input.title.trim().length > 120) {
    errors.push('O campo title deve ter no máximo 120 caracteres');
  } else {
    data.title = input.title.trim();
  }

  if (input.description !== undefined) {
    if (input.description !== null && typeof input.description !== 'string') {
      errors.push('O campo description deve ser um texto');
    } else {
      data.description = input.description;
    }
  }

  if (input.priority !== undefined) {
    if (!PRIORITIES.includes(input.priority as TaskPriority)) {
      errors.push(`O campo priority deve ser um destes valores: ${PRIORITIES.join(', ')}`);
    } else {
      data.priority = input.priority as TaskPriority;
    }
  }

  if (input.status !== undefined) {
    if (!STATUSES.includes(input.status as TaskStatus)) {
      errors.push(`O campo status deve ser um destes valores: ${STATUSES.join(', ')}`);
    } else {
      data.status = input.status as TaskStatus;
    }
  }

  if (input.dueDate !== undefined) {
    if (input.dueDate === null) {
      data.dueDate = null;
    } else if (typeof input.dueDate !== 'string' || !isValidDate(input.dueDate)) {
      errors.push('O campo dueDate deve ser uma data válida no formato AAAA-MM-DD');
    } else {
      data.dueDate = input.dueDate;
    }
  }

  return { data, errors };
}

export async function listTasks(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'O parâmetro id deve ser um número inteiro positivo' });
      return;
    }
    const task = await Task.findByPk(id);
    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { data, errors } = validateBody(req.body, true);
    if (errors.length > 0 || data.title === undefined) {
      res.status(400).json({ message: 'Dados inválidos', errors });
      return;
    }
    const task = await Task.create({ ...data, title: data.title });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'O parâmetro id deve ser um número inteiro positivo' });
      return;
    }
    const { data, errors } = validateBody(req.body, true);
    if (errors.length > 0) {
      res.status(400).json({ message: 'Dados inválidos', errors });
      return;
    }
    const task = await Task.findByPk(id);
    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }
    await task.update(data);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'O parâmetro id deve ser um número inteiro positivo' });
      return;
    }
    const task = await Task.findByPk(id);
    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }
    await task.destroy();
    res.status(200).json({ message: 'Tarefa removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
