# 🧹 Penpot to Android XML Plugin

This project provides a Penpot plugin with an integrated Flask backend that **converts Penpot design boards and their child elements into Android-compatible XML layout files and gradient drawable XML**. It enables a seamless designer-to-developer handoff by automatically generating Android UI markup from Penpot designs.

---

## 🚀 Features

- ✅ **Converts Penpot boards and child shapes** into Android `XML` layouts.
- 🎨 **Supports gradients** by generating Android-compatible gradient drawable XML.
- 🔀 **Bi-directional plugin-backend communication**: frontend plugin sends board data to backend, which returns structured XML.
- 🧪 **Dev-friendly environment** with concurrent server setup for both frontend and backend.
- 📁 **Auto-build frontend** using modern tooling (`Vite`, `npm`).

---

## 🗂️ Project Structure

```
/
├── dist/              # Production build of the frontend (gitignored)
├── node_modules/      # Node.js dependencies (gitignored)
├── public/            # Static frontend assets (manifest, icons, etc.)
├── src/               # Frontend source code (Penpot plugin logic)
├── server.py          # Flask backend for XML conversion
├── app.py             # Launches both frontend & backend concurrently
├── package.json       # Frontend dependencies and scripts
├── requirements.txt   # Python dependencies
├── README.md          # This documentation file
├── .gitignore         # Git ignore rules
└── ...
```

---

## ✨ Prerequisites

- Python 3.7 or higher
- Node.js (v14 or higher) & npm
- Penpot account (self-hosted or cloud) to use the plugin

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/penpot-android-xml-plugin.git
cd penpot-android-xml-plugin
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Install frontend dependencies:

```bash
npm install
```

Install required Penpot plugin templates:

```bash
npm install @penpot/plugin-styles @penpot/plugin-types
```

Install `concurrently` to run both frontend and backend:

```bash
npm install -D concurrently
```

---

## 🚀 Running the Project

To start both backend (Flask) and frontend (Vite Dev Server) simultaneously:

```bash
python app.py
```

- Flask backend runs at: `http://localhost:4001`
- Frontend plugin dev server runs at: `http://localhost:3000` (or Vite default)

---

## 🧩 How to Use This Plugin in Penpot

After starting the development server, open:

```
http://localhost:5173/manifest.json
http://localhost:5173/plugin.js
```

Make sure these URLs are accessible.

### Install the Plugin in Penpot

1. Open Penpot in your browser.
2. Press `Ctrl + Alt + P` to open the Plugin Manager.
3. Enter your plugin manifest URL, e.g.:

```
http://localhost:5173/manifest.json
```

4. Click **Install**.

Your plugin will now be available inside the Penpot UI.

---

## 🔧 Usage

1. Launch Penpot and open your design.
2. Use the plugin to select a board and its children.
3. The plugin sends design data to the Flask backend.
4. The backend generates Android XML and returns it to the UI.
5. You can copy and use this XML in your Android Studio project.

---

## 📁 Development Notes

- Frontend plugin source code: `src/`
- Backend Flask server logic: `server.py`
- Update conversion logic in: `convert_penpot_to_android_xml()`
- Production build (frontend):

```bash
npm run build
```

This generates files into the `dist/` directory.

---

## 📝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Submit a Pull Request with a clear description

---

## 📋 License

This project is licensed under the **MIT License**.

---

## 🙇 Acknowledgments

- [Penpot](https://penpot.app) — for the design environment
- [Flask](https://flask.palletsprojects.com/) and Flask-CORS — backend API
- [Vite](https://vitejs.dev/) — fast frontend dev experience
- [GitHub](https://github.com) — for project hosting
