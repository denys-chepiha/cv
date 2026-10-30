// Core
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function temporaryRepository(t) {
  const directory = mkdtempSync(join(tmpdir(), 'cv-privacy-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  execFileSync('git', ['init', '--quiet'], { cwd: directory });
  copyFileSync(join(root, '.gitignore'), join(directory, '.gitignore'));
  return directory;
}

test('ignores private directories, documents, credentials, and unreviewed paths', (t) => {
  const cwd = temporaryRepository(t);
  const paths = [
    'users/Example Person/data.json', 'knowledge/profile.md', 'photo/portrait.png',
    'src/resumes/Example/data.json', 'src/pending/Example/resume.md',
    'src/denials/Example/message.txt', 'src/english/preparation.md', 'src/info/notes.md',
    'private/profile.json', 'another-person/details.txt', 'CV.pdf', 'CV.docx',
    'templates/real-profile.json', 'scripts/data.json', 'docs/private-notes.md',
    'tests/real-candidate.json', '.env', '.env.local', 'key.pem', 'node_modules/package/index.js',
    '.claude/settings.local.json', '.codex/config.toml', '.DS_Store', '.publish/cv/README.md',
  ];
  const result = execFileSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
    cwd, input: paths.join('\0') + '\0', encoding: 'utf8',
  });
  assert.deepEqual(result.split('\0').filter(Boolean), paths);
});

test('allows reviewed instructions, architecture, sources, and fictional data', (t) => {
  const cwd = temporaryRepository(t);
  const paths = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'package.json', 'package-lock.json',
    'scripts/generate.js', 'templates/data.example.json', 'templates/ui-registry.js',
    'docs/workflows/document-package.md', 'docs/architecture/components.md',
    '.codex/skills/resume-tailoring-orchestrator/SKILL.md', 'tests/privacy.test.js'];
  const result = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
    cwd, input: paths.join('\0') + '\0', encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
});

test('privacy check detects a force-added private file', (t) => {
  const cwd = temporaryRepository(t);
  mkdirSync(join(cwd, 'users'));
  writeFileSync(join(cwd, 'users/profile.json'), '{}');
  execFileSync('git', ['add', '--', '.gitignore'], { cwd });
  const check = () => spawnSync(process.execPath, [join(root, 'scripts/checkPrivacy.js')], { cwd, encoding: 'utf8' });
  assert.equal(check().status, 0);
  execFileSync('git', ['add', '--force', '--', 'users/profile.json'], { cwd });
  const blocked = check();
  assert.equal(blocked.status, 1);
  assert.match(blocked.stderr, /users\/profile\.json/);
});

test('bundled profile and signatures are fictional', () => {
  const data = JSON.parse(readFileSync(join(root, 'templates/data.example.json'), 'utf8'));
  assert.equal(data.personal.name, 'Example Candidate');
  assert.equal(data.personal.email, 'candidate@example.com');
  assert.equal(data.personal.phone, '');
  for (const letter of Object.values(data.coverLetter)) {
    assert.equal(letter.signature, 'Example Candidate');
  }
});

test('a fictional package generates generic filenames inside an ignored directory', { timeout: 60000 }, (t) => {
  const company = `privacy-test-${process.pid}`;
  const directory = join(root, 'src/resumes', company);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  execFileSync(process.execPath, ['scripts/new-company.js', company], { cwd: root, timeout: 10000 });
  const data = JSON.parse(readFileSync(join(directory, 'data.json'), 'utf8'));
  assert.equal(data.meta.company, company);
  assert.equal(data.personal.name, 'Example Candidate');
  execFileSync(process.execPath, ['scripts/generate.js', company], { cwd: root, timeout: 45000 });
  const outputs = ['CV.docx', 'CV.pdf', 'Cover_Letter_EN.pdf', 'Cover_Letter_RU.pdf', 'Cover_Letter.txt'];
  assert.deepEqual(readdirSync(directory).sort(), [...outputs, 'data.json', 'vacancy.md'].sort());
  for (const name of outputs) {
    const bytes = readFileSync(join(directory, name));
    assert.ok(bytes.length > 50);
    if (name.endsWith('.pdf')) assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    if (name.endsWith('.docx')) assert.equal(bytes.subarray(0, 2).toString(), 'PK');
    const relative = `src/resumes/${company}/${name}`;
    assert.equal(execFileSync('git', ['check-ignore', '--no-index', relative], { cwd: root, encoding: 'utf8' }).trim(), relative);
  }
});
