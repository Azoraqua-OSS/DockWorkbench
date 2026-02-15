import { spawn } from 'node:child_process';

const commands = [
  {
    name: 'app',
    command: 'pnpm',
    args: ['dev'],
  },
  {
    name: 'storybook',
    command: 'pnpm',
    args: ['storybook', '--ci', '--host', '127.0.0.1', '--port', '6006'],
  },
];

const children = [];
let shuttingDown = false;
let remaining = commands.length;
let exitCode = 0;

const stopChildren = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

const shutdown = (code = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  exitCode = code;
  stopChildren();
};

for (const proc of commands) {
  const child = spawn(proc.command, proc.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  children.push(child);

  child.on('error', () => {
    console.error(`Failed to start ${proc.name}`);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    remaining -= 1;

    if (!shuttingDown) {
      const normalizedCode = typeof code === 'number' ? code : signal ? 1 : 0;
      shutdown(normalizedCode);
    }

    if (remaining === 0) {
      process.exit(exitCode);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
