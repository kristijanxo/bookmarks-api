#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/598cc6083c04a02381b28f11bc760356402d5ad21f2fa7be812c89aa408fc936/contract';
import endContract from '../../snapshots/598cc6083c04a02381b28f11bc760356402d5ad21f2fa7be812c89aa408fc936/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/5f438d24e4ade1644c73046712bb0375c07f9fc35a66819779089d79e8304bbf/contract';
import startContract from '../../snapshots/5f438d24e4ade1644c73046712bb0375c07f9fc35a66819779089d79e8304bbf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'bookmark' }),
      this.dropTable({ schema: 'public', table: 'user' }),
      this.createTable({
        schema: 'public',
        table: 'bookmarks',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('first_name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('last_name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookmarks',
        index: 'bookmarks_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookmarks',
        foreignKey: {
          name: 'bookmarks_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
