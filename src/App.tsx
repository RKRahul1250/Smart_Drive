import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadZone } from './components/upload/UploadZone';
import { UploadQueue } from './components/upload/UploadQueue';
import { AssetLibrary } from './components/library/AssetLibrary';
import { useUploadManager } from './hooks/useUploadManager';
import { useThemeStore } from './store/useThemeStore';
import { HardDrive, Settings, Bell, User, SunMedium, Moon, X } from 'lucide-react';

function App() {
  const { theme, toggleTheme } = useThemeStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useUploadManager();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500"
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2"
            >
              <div className="rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 p-2 text-white shadow-lg shadow-blue-500/20">
                <HardDrive className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">SmartDrive</span>
            </motion.div>

            <div className="flex items-center gap-3">
              <button className="rounded-2xl p-2 text-slate-500 transition-colors duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="rounded-2xl p-2 text-slate-500 transition-colors duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-950">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">File Manager</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Upload, manage and organize your assets in one place.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 space-y-6">
              <UploadZone />
              <UploadQueue />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-8"
          >
            <AssetLibrary />
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.section
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative mx-4 mb-6 w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold">Settings</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Customize your experience and theme preferences.
                  </p>
                </div>
                <button
                  className="rounded-full p-2 text-slate-600 transition-colors duration-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Day / Night Mode</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Toggle the app theme and save your preference.
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="relative inline-flex h-11 w-20 items-center rounded-full bg-slate-300 p-1 transition-all duration-300 ease-out dark:bg-slate-700"
                      aria-label="Toggle theme"
                    >
                      <motion.span
                        layout
                        className={`absolute left-1 top-1 h-9 w-9 rounded-full bg-white shadow transition-transform duration-300 ease-out ${theme === 'dark' ? 'translate-x-[calc(100%-0.5rem)] bg-slate-900 text-amber-300' : 'translate-x-0 bg-amber-400 text-slate-900'}`}
                      >
                        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
                      </motion.span>
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="text-sm font-semibold">Smooth motion</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Animations are now smoother and more fluid across the entire interface.
                  </p>
                </motion.div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
