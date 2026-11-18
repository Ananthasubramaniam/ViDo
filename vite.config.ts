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
    name: 'firebase-emulators',
    apply: 'serve',
    async configureServer(server) {
      const authPort = 9099;
      const firestorePort = 8080;
      const [authRunning, firestoreRunning] = await Promise.all([
        checkPort(authPort),
        checkPort(firestorePort),
      ]);

      if (authRunning && firestoreRunning) {
        console.log(
          `\n\x1b[32m[ViDo Emulators]\x1b[0m Auth :${authPort} and Firestore :${firestorePort} are active.\n`
        );
        return;
      }

      console.log(
        `\n\x1b[33m[ViDo Emulators]\x1b[0m Checking local Firebase emulator ports...\n`
      );

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
          `\x1b[31m[ViDo Emulators]\x1b[0m Java 11+ is required for the Firebase emulators.\n` +
            `           Install Java or run "npm run emu" in a separate terminal.\n`
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

      const only = [
        !authRunning ? 'auth' : null,
        !firestoreRunning ? 'firestore' : null,
      ]
        .filter(Boolean)
        .join(',');

      console.log(
        `\x1b[36m[ViDo Emulators]\x1b[0m Starting missing emulator(s): ${only}...\n`
      );

      const [cmd, ...args] = firebaseCmd.split(' ');
      const fullArgs = [
        ...args,
        'emulators:start',
        '--only',
        only,
        '--project',
        'demo-vido',
      ];

      emulatorProcess = spawn(cmd, fullArgs, {
        shell: true,
        stdio: 'inherit',
      });

      emulatorProcess.on('error', (err) => {
        console.warn(
          `\x1b[31m[ViDo Emulators]\x1b[0m Failed to spawn Firebase emulator:`,
          err.message
        );
      });

      // Poll until both required ports are listening (up to 15 seconds)
      const maxAttempts = 30;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await new Promise((res) => setTimeout(res, 500));
        const ready = await Promise.all([
          checkPort(authPort),
          checkPort(firestorePort),
        ]);
        if (ready.every(Boolean)) {
          console.log(
            `\n\x1b[32m[ViDo Emulators]\x1b[0m ✓ Auth :${authPort} and Firestore :${firestorePort} are ready.\n`
          );
          break;
        }
      }

      const cleanup = () => {
        if (emulatorProcess && !emulatorProcess.killed) {
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${emulatorProcess.pid} /T /F`, {
                stdio: 'ignore',
              });
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
