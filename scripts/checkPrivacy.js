#!/usr/bin/env node
// Core
import { execFileSync, spawnSync } from 'node:child_process';

const tracked = execFileSync('git', ['ls-files', '--cached', '-z']);
const result = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
  input: tracked,
  encoding: 'utf8',
});

if (result.error) throw result.error;
if (result.status !== 0 && result.status !== 1) {
  throw new Error(result.stderr || 'Git privacy check failed.');
}

const excluded = result.stdout.split('\0').filter(Boolean);
if (excluded.length) {
  console.error('Tracked files violate the publication allowlist:');
  for (const path of excluded) console.error(path);
  process.exitCode = 1;
} else {
  console.log('All tracked paths comply with the publication allowlist. Review their content before publishing.');
}
