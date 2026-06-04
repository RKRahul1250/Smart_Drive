# Smart Asset & File Manager

A production-grade frontend technical assessment for a File Management system. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight, high-performance state)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Upload Handling**: [react-dropzone](https://react-dropzone.js.org/)
- **Drag & Drop Reordering**: [@dnd-kit](https://dnd-kit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Formatting**: [date-fns](https://date-fns.org/)

## ✨ Key Features

- **Advanced Upload Queue**:
  - Drag & drop multi-file and folder support.
  - Real-time progress tracking.
  - State machine lifecycle: `Idle` → `Validating` → `Uploading` → `Success`/`Failed`.
  - Concurrent upload limiting (max 3 at a time).
  - Retry mechanism for failed uploads.
- **Asset Library**:
  - Grid and List view toggles.
  - Search and filtering.
  - Sorting by name, size, and date.
  - **Drag-to-reorder** support in both views.
  - Multi-select actions (bulk delete).
- **UX & Performance**:
  - Responsive design (Mobile, Tablet, Desktop).
  - Optimistic UI updates.
  - Accessible interactions and semantic HTML.
  - Mock API layer simulating real-world network conditions.

## 💾 Storage & Persistence

This application uses a sophisticated local persistence layer:

- **IndexedDB (via Dexie.js)**: All uploaded files (including the actual binary data/Blobs) are saved in an IndexedDB database named `SmartDriveDB`.
- **Persistence Scope**: 
  - **Local Persistence**: Files remain accessible even after browser refreshes or closing the tab.
  - **Data Safety**: Large files (up to browser limits, usually several GBs) can be stored without blocking the UI thread.
- **Cross-Device Accessibility**: 
  - As this is a client-side mini-product, files are currently scoped to the **specific browser and device** where they were uploaded.
  - **Production Path**: To enable true cross-device access, the `uploadService.ts` and `useAssetStore.ts` are architected to be easily swapped with a cloud storage provider (like AWS S3, Google Cloud Storage, or Cloudinary) and a backend database (PostgreSQL/MongoDB).

## 🔍 File Viewing & Interaction

- **Interactive Preview**: Clicking any asset opens a high-fidelity **Preview Modal**.
- **Media Support**: 
  - **Images**: High-resolution previews with zoom-friendly containment.
  - **Videos**: Integrated HTML5 video player for MP4s.
  - **PDFs**: Embedded PDF viewer for document reading.
  - **Other Files**: Informative placeholder with metadata and download options.
- **Actions**: Direct download capability for all stored assets, retrieving the original binary data from IndexedDB.

## 🤖 AI Usage Disclosure

This project was built with the assistance of **Trae AI (Gemini-3-Flash)**.

- **AI-Assisted**:
  - Boilerplate setup for Vite and Tailwind.
  - Initial component structure and styling logic.
  - State machine logic for the upload queue.
  - Documentation and README structure.
- **Manual/Human Implementation**:
  - Core architecture design.
  - Integration of `dnd-kit` for complex reordering.
  - Business logic for concurrent upload management.
  - Custom UI/UX refinements and responsive adjustments.

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📝 Assumptions & Tradeoffs

- **Mock API**: Since there's no backend, uploads are simulated with random delays and failure rates (5%) to demonstrate error handling.
- **Local Storage**: For this assessment, assets are stored in memory. In a real product, these would be persisted via an API or LocalStorage.
- **File Validation**: Basic rules implemented (max 10MB, specific image/pdf/video types, duplicate name detection).

## 🔮 Future Improvements

- **Chunked Uploads**: For very large files.
- **Pause/Resume**: Better control for long-running uploads.
- **Persistence**: Save state to LocalStorage or IndexedDB.
- **Image Optimization**: Auto-generate thumbnails on the client side before upload.
- **Folder Structure Persistence**: Reconstruct folder hierarchies in the library view.
