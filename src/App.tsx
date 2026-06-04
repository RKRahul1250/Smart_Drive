import { UploadZone } from './components/upload/UploadZone';
import { UploadQueue } from './components/upload/UploadQueue';
import { AssetLibrary } from './components/library/AssetLibrary';
import { useUploadManager } from './hooks/useUploadManager';
import { HardDrive, Settings, Bell, User } from 'lucide-react';

function App() {
  // Orchestrate the upload process
  useUploadManager();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                <HardDrive className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">SmartDrive</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-950">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">File Manager</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload, manage and organize your assets in one place.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Upload Section */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <UploadZone />
              <UploadQueue />
            </div>
          </div>

          {/* Right Column: Library Section */}
          <div className="lg:col-span-8">
            <AssetLibrary />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
