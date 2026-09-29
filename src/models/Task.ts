import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

// Interface TypeScript que representa a entidade Task.
export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  'id' | 'description' | 'priority' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt'
>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare priority: TaskPriority;
  declare status: TaskStatus;
  declare dueDate: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    priority: {
      type: DataTypes.ENUM('baixa', 'media', 'alta'),
      allowNull: false,
      defaultValue: 'media',
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em_andamento', 'concluida'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    dueDate: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { sequelize, tableName: 'tasks', modelName: 'Task' },
);
