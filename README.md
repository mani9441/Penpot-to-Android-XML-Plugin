Penpot to Android XML Plugin
This project provides a Penpot plugin along with a backend Flask server to convert Penpot design boards and their child elements into Android XML layout files and gradient drawable XML. It enables designers and developers to quickly generate Android-compatible UI XML from Penpot designs.
Features

Converts Penpot boards and child shapes into Android XML layouts.
Supports gradients by generating Android gradient drawable XML.
Frontend plugin interacts with Penpot and sends selected board data to the backend.
Backend Flask server handles conversion and returns XML.
Development setup to run frontend and backend concurrently.

Project Structure
/
├── dist/ # Built frontend output (ignored in repo)
├── node_modules/ # Node dependencies (ignored)
├── public/ # Static assets for frontend
├── src/ # Frontend source code (Penpot plugin)
├── server.py # Flask backend server
├── app.py # Runs frontend dev server + backend server concurrently
├── package.json # Frontend dependencies and scripts
├── requirements.txt # Python dependencies
├── README.md # This documentation
├── .gitignore # Git ignore rules
└── ...

Prerequisites

Python 3.7 or higher
Node.js (v14 or higher) and npm
Penpot account to use the plugin

Installation

Clone the repository:

git clone https://github.com/yourusername/penpot-android-xml-plugin.git
cd penpot-android-xml-plugin

Install Python dependencies:

pip install -r requirements.txt

Install frontend dependencies:

npm install

Install Penpot templates:

npm install @penpot/plugin-styles @penpot/plugin-types

Install concurrently as a dev dependency:

npm install -D concurrently

Running the Project
To run both the backend Flask server and the frontend development server simultaneously, run:
python app.py

Flask backend will run on http://localhost:4001
Frontend dev server (npm) will run on http://localhost:3000 or the configured port

🧩 How to Add This Plugin to Penpot
Once you have started the plugin's development server (via npm run dev or using app.py), it will be accessible on a local port — for example:
http://localhost:5173

Make sure the following files are accessible in your browser:

http://localhost:5173/manifest.json
http://localhost:5173/plugin.js

⚠️ If you’re serving your plugin from a subdirectory (e.g., /public), adjust the path accordingly:

http://localhost:5173/public/manifest.json

🔌 Install the Plugin in Penpot

Open Penpot in your browser.

Press Ctrl + Alt + P to open the Plugin Manager.

In the modal that appears, enter the full URL of your plugin's manifest.json. For example:
http://localhost:5173/manifest.json

Click Install.

Your plugin should now be available for use inside Penpot.

You can launch the plugin from the Plugin Manager any time after installation.
Usage

Open Penpot and use the plugin to select a design board and its children.
The plugin sends selected data to the backend.
The backend converts the design into Android XML layouts and gradient drawable XML.
The XML output is returned and displayed for use in Android projects.

Development

Frontend source is located in the src/ directory.
Backend Flask API is implemented in server.py.
Customize the conversion logic in the convert_penpot_to_android_xml() function in server.py.
Run npm run build to create a production build of the frontend inside the dist/ folder.

Contributing
Contributions are welcome! Please fork the repo, create a new branch, and submit a pull request.
License
This project is licensed under the MIT License.
Acknowledgments

Penpot Design Tool for the design environment.
Flask and Flask-CORS for backend API.
Vite and your chosen frontend framework for plugin UI.
