import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import net from 'node:net';
import { spawn, execSync, type ChildProcess } from 'node:child_process';

function checkPort(port: number, host = '127.0.0.1', timeout = 600): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

function firebaseEmulatorPlugin(): Plugin {
  let emulatorProcess: ChildProcess | null = null;

  return {
    name: 'firebase-auth-emulator',
    apply: 'serve',
    async configureServer(server) {
      const port = 9099;
      const isRunning = await checkPort(port);

      if (isRunning) {
        console.log(`\n\x1b[32m[ViDo Auth]\x1b[0m Firebase Auth Emulator is active on http://localhost:${port}\n`);
        return;
      }

      console.log(`\n\x1b[33m[ViDo Auth]\x1b[0m Checking Firebase Auth Emulator status on port ${port}...`);

      // Check if Java is available
      let hasJava = false;
      try {
        execSync('java -version', { stdio: 'ignore' });
        hasJava = true;
      } catch {
        hasJava = false;
      }

      if (!hasJava) {
        console.warn(
          `\x1b[31m[ViDo Auth]\x1b[0m Java 11+ is required for the Firebase Auth Emulator.\n` +
          `           Please install Java to run the local Auth emulator, or configure live Firebase keys in .env.local.\n`
        );
        return;
      }

      // Check for firebase CLI (global or local)
      let firebaseCmd = 'firebase';
      try {
        execSync('firebase --version', { stdio: 'ignore' });
      } catch {
        firebaseCmd = 'npx firebase';
      }

      console.log(`\x1b[36m[ViDo Auth]\x1b[0m Automatically starting Firebase Auth Emulator on port ${port}...\n`);

      const [cmd, ...args] = firebaseCmd.split(' ');
      const fullArgs = [...args, 'emulators:start', '--only', 'auth', '--project', 'demo-vido'];

      emulatorProcess = spawn(cmd, fullArgs, {
        shell: true,
        stdio: 'inherit',
      });

      emulatorProcess.on('error', (err) => {
        console.warn(`\x1b[31m[ViDo Auth]\x1b[0m Failed to spawn Firebase emulator:`, err.message);
      });

      // Poll until port 9099 is listening (up to 15 seconds)
      const maxAttempts = 30;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise((res) => setTimeout(res, 500));
        const ready = await checkPort(port);
        if (ready) {
          console.log(`\n\x1b[32m[ViDo Auth]\x1b[0m ✓ Firebase Auth Emulator is ready at http://localhost:${port}\n`);
          break;
        }
      }

      const cleanup = () => {
        if (emulatorProcess && !emulatorProcess.killed) {
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${emulatorProcess.pid} /T /F`, { stdio: 'ignore' });
            } else {
              emulatorProcess.kill('SIGTERM');
            }
          } catch {
            // Ignore if already terminated
          }
          emulatorProcess = null;
        }
      };

      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      server.httpServer?.on('close', cleanup);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), firebaseEmulatorPlugin()],
});
