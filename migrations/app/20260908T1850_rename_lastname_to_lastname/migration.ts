#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5f438d24e4ade1644c73046712bb0375c07f9fc35a66819779089d79e8304bbf/contract';
import endContract from '../../snapshots/5f438d24e4ade1644c73046712bb0375c07f9fc35a66819779089d79e8304bbf/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/831331a430c674b93bcbeb0b18f984f482f263e31f8a60ab73ccd0b1df3c5c72/contract';
import startContract from '../../snapshots/831331a430c674b93bcbeb0b18f984f482f263e31f8a60ab73ccd0b1df3c5c72/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'user', column: 'lastname' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('lastName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
