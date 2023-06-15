const config = require('./config.json');
const express = require('express');
const fs = require('fs');
const app = express();
const session = require('express-session');
const port = 3000;

require('dotenv').config();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is logged in
function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    const accessDeclineHTML = `
    <!DOCTYPE html>
<html>
<head>
  <title>Access Decline</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <style>
    body {
      background-color: #111111;
      color: #ffffff;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    }

    h1 {
      color: #ff9900;
      font-size: 48px;
      margin-bottom: 20px;
      animation: fadeInDown 1s ease;
    }

    p {
      font-size: 24px;
      animation: fadeInUp 1s ease;
    }

    .icon-container {
      margin-top: 50px;
      animation: fadeIn 1s ease;
    }

    .icon {
      color: #ff9900;
      font-size: 100px;
      margin-bottom: 20px;
      animation: bounce 1s infinite;
    }

    .message {
      color: #ffffff;
      font-size: 20px;
      margin-bottom: 20px;
      animation: fadeIn 1s ease;
    }

    .button {
      background-color: #337ab7;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      margin: 0 5px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      animation: fadeIn 1s ease;
    }

    .button:hover {
      background-color: #ff9900;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInDown {
      0% {
        opacity: 0;
        transform: translateY(-20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }
  </style>
</head>
<body>
  <h1>Access Decline</h1>
  <p>Sorry, but your access has been declined.</p>
  
  <div class="icon-container">
    <i class="fa fa-ban icon"></i>
  </div>

  <p class="message">Please contact the administrator for further assistance.</p>

  <div>
    <a href="/" class="button">Go Back</a>
  </div>
</body>
</html>
    `;
    res.send(accessDeclineHTML);
  }
}


// Handle the login form submission
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username and password are correct
  if (username === config.username && password === config.password) {
    // Set the user session or token
    req.session.user = username; // Store the username in the session
    // Alternatively, you can use a token
    // req.query.token = 'your_token';
    res.redirect('/edit');
  } else {
    const invalidLoginPage = `
    <html>
    <head>
      <title>Invalid Username or Password</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <style>
        body {
          background-color: #111111;
          color: #ffffff;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        }
    
        h1 {
          color: #ff9900;
          font-size: 48px;
          margin-bottom: 20px;
          animation: fadeInDown 1s ease;
        }
    
        p {
          font-size: 24px;
          animation: fadeInUp 1s ease;
        }
    
        .icon-container {
          margin-top: 50px;
          animation: fadeIn 1s ease;
        }
    
        .icon {
          color: #ff9900;
          font-size: 100px;
          margin-bottom: 20px;
          animation: bounce 1s infinite;
        }
    
        .message {
          color: #ffffff;
          font-size: 20px;
          margin-bottom: 20px;
          animation: fadeIn 1s ease;
        }
    
        .button {
          background-color: #337ab7;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          margin: 0 5px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          animation: fadeIn 1s ease;
        }
    
        .button:hover {
          background-color: #ff9900;
        }
    
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
      </style>
    </head>
    <body>
      <h1>Invalid Username or Password</h1>
      <p>Sorry, but the username or password you entered is incorrect.</p>
      
      <div class="icon-container">
        <i class="fa fa-exclamation-triangle icon"></i>
      </div>
    
      <p class="message">Please try again.</p>
    
      <div>
        <a href="./" class="button">Go Back</a>
      </div>
    </body>
    </html>
    `;
    res.send(invalidLoginPage);
  }
});


// Serve the login page
app.get('/', (req, res) => {
  res.send(`
    <html>
  <head>
    <style>
      body {
        background-image: url('https://cdn.discordapp.com/attachments/1112975745212489808/1113363175220465744/3022628.jpg');
        background-size: cover;
        font-family: Arial, sans-serif;
        text-align: center;
      }

      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .login-form {
        width: 300px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #333333;
        margin-bottom: 20px;
      }

      form {
        margin-top: 20px;
      }

      input[type="text"],
      input[type="password"],
      textarea {
        padding: 10px;
        margin-bottom: 10px;
        width: 100%;
      }

      input[type="submit"] {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        width: 100%;
      }

      a {
        color: #337ab7;
        text-decoration: none;
      }

      .file-list {
        margin-top: 20px;
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        .login-form {
          width: 90%;
        }
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <div class="login-form">
        <h1>Login</h1>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <input type="submit" value="Login">
        </form>
      </div>
    </div>
  </body>
</html>
  `);
});

// Serve the file editor page
app.get('/edit', requireLogin, (req, res) => {
  // Fetch the list of files and populate the select options
  fs.readdir('stock', (err, stockFiles) => {
    if (err) {
      res.send(`Error reading directory: ${err}`);
    } else {
      fs.readdir('pstock', (err, pstockFiles) => {
        if (err) {
          res.send(`Error reading directory: ${err}`);
        } else {
          const stockFileLinks = stockFiles.map((file) => {
            return `<div class="file-item">
              <span class="file-icon"><i class="fa fa-file-text-o"></i></span>
              <a href="/edit/stock/${file}" class="file-name">${file}</a>
              <div class="file-actions">
                <button onclick="renameFile('stock', '${file}')">Rename</button>
                <button onclick="deleteFile('stock', '${file}')">Delete</button>
              </div>
            </div>`;
          }).join('');

          const pstockFileLinks = pstockFiles.map((file) => {
            return `<div class="file-item">
              <span class="file-icon"><i class="fa fa-file-text-o"></i></span>
              <a href="/edit/pstock/${file}" class="file-name">${file}</a>
              <div class="file-actions">
                <button onclick="renameFile('pstock', '${file}')">Rename</button>
                <button onclick="deleteFile('pstock', '${file}')">Delete</button>
              </div>
            </div>`;
          }).join('');

          res.send(`
          <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #111111;
                color: #ffffff;
              }
          
              h1 {
                color: #337ab7;
                font-size: 48px;
                margin-bottom: 20px;
              }
          
              h2 {
                color: #ffffff;
                font-size: 32px;
                margin-bottom: 10px;
              }
          
              a {
                color: #337ab7;
                text-decoration: none;
                transition: color 0.3s ease;
              }
          
              a:hover {
                color: #ff9900;
              }
          
              .file-list {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
                width: 80%;
                margin-left: auto;
                margin-right: auto;
              }
          
              .file-item {
                background-color: #222222;
                border: 1px solid #444444;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 4px;
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                transition: background-color 0.3s ease;
              }
          
              .file-icon {
                background-color: #337ab7;
                width: 30px;
                height: 30px;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
          
              .file-icon i {
                color: #fff;
              }
          
              .file-item:hover {
                background-color: #333333;
                border-color: #777777;
              }
          
              .file-name {
                font-size: 16px;
              }
              
          
              .file-actions {
                display: flex;
                align-items: center;
                margin-left: auto;
              }
          
              .file-actions button {
                background-color: transparent;
                border: none;
                color: #337ab7;
                margin-left: 10px;
                cursor: pointer;
                transition: color 0.3s ease;
              }
          
              .file-actions button:hover {
                color: #ff9900;
              }
              /* Add styles for the buttons */
              .button-container {
                display: flex;
                justify-content: center;
                margin-top: 20px;
                margin-bottom: 20px;
              }
          
              .button {
                background-color: #337ab7;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 0 5px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
              }
          
              .button:hover {
                background-color: #ff9900;
              }
              
              /* Hide scrollbar */
              .file-list::-webkit-scrollbar {
                display: none;
              }
          
              /* Fancy and Cool Look */
              .file-select {
                display: flex;
                align-items: center;
                margin-right: 10px;
              }
              
              .file-select select {
                display: block;
                padding: 10px;
                border: none;
                border-radius: 4px;
                background-color: #444444;
                color: #ffffff;
                font-size: 16px;
              }
              
              .fancy-input-container {
                display: flex;
                align-items: center;
                justify-content: center; /* Center the elements horizontally */
              }

                .fancy-input {
                  display: flex;
                  align-items: center;
                  margin-right: 10px;
                }
              
              .fancy-input input[type="text"] {
                padding: 10px;
                border: none;
                border-radius: 4px;
                background-color: #444444;
                color: #ffffff;
                font-size: 16px;
                /* Add fancy border and focus styles */
                border: 2px solid #337ab7;
                transition: border-color 0.3s ease;
              }
              
              .fancy-input input[type="text"]:focus {
                border-color: #ff9900;
                outline: none;
              }

              .fancy-input i {
                margin-left: 10px;
                color: #337ab7;
              }
              
              .fancy-button {
                background-color: #337ab7;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s ease;
              }
              
              .fancy-button:hover,
              .fancy-button:focus {
               background-color: #ff9900;
               outline: none;
               
              }
              
              .footer {
                background-color: #111111;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
          
              .footer-text {
                font-size: 14px;
              }
          
              .footer-link {
                color: #337ab7;
                text-decoration: none;
                transition: color 0.3s ease;
              }
          
              .footer-link:hover {
                color: #ff9900;
              }
            </style>
          </head>
          <body>
            <h1>File Manager</h1>
            <div class="button-container">
              <button class="button" onclick="showCreateForm()">Create</button>
            </div>
          
            <form id="create-form" action="/create" method="post" style="display: none;">
              <h2>Create File</h2>
              <div class="fancy-input-container">
                <div class="file-select">
                  <select id="create-folder-select" name="folder" required>
                    <option value="stock">Stock</option>
                    <option value="pstock">Pstock</option>
                  </select>
                </div>
                <div class="fancy-input">
                  <input id="create-file-name" type="text" name="fileName" placeholder="File Name" required>
                  <i class="fa fa-file" aria-hidden="true"></i>
                </div>
                <button class="fancy-button" type="button" onclick="createFile()">Create</button>
              </div>
            </form>
          
            <h2>Stock Files</h2>
            <div class="file-list">
              ${stockFileLinks}
            </div>
          
            <h2>Pstock Files</h2>
            <div class="file-list">
              ${pstockFileLinks}
            </div>

            <div class="footer">
             <p class="footer-text">Made with <i class="fa fa-heart"></i> by <a class="footer-link" href="https://www.youtube.com/c/ScienceGearYT?sub_confirmation=1">ScienceGear</a></p>
            </div>

            <script>
            function showCreateForm() {
              document.getElementById("create-form").style.display = "block";
              document.getElementById("rename-form").style.display = "none";
              document.getElementById("delete-form").style.display = "none";
            }
            
            function createFile() {
              const folder = document.getElementById("create-folder-select").value;
              const fileName = document.getElementById("create-file-name").value;
            
              // Send an AJAX request to the server to create the file
              fetch('/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  folder: folder,
                  fileName: fileName
                })
              })
                .then(response => response.text())
                .then(message => {
                  alert(message); // Show a pop-up message with the response from the server
                  // Refresh the page to reflect the changes
                  location.reload();
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            }            
          
              function renameFile(folder, fileName) {
                const newName = prompt('Enter the new name for the file:');
                if (newName !== null) {
                  // Send an AJAX request to the server to rename the file
                  fetch('/rename', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      folder: folder,
                      oldFileName: fileName,
                      newFileName: newName
                    })
                  })
                    .then(response => response.text())
                    .then(message => {
                      alert(message);
                      // Refresh the page to reflect the changes
                      location.reload();
                    })
                    .catch(error => {
                      console.error('Error:', error);
                    });
                }
              }
          
              function deleteFile(folder, fileName) {
                // Send an AJAX request to the server to delete the file
                fetch('/delete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    folder: folder,
                    fileName: fileName
                  })
                })
                  .then(response => response.text())
                  .then(message => {
                    alert(message);
                    // Refresh the page to reflect the changes
                    location.reload();
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
            </script>
          </body>
          </html>          
          `);
        }
      });
    }
  });
});


app.use(express.urlencoded({ extended: true }));


// Handle the creation of a new file
app.post('/create', requireLogin, (req, res) => {
  const folder = req.body.folder;
  const fileName = req.body.fileName;

  // Check if the folder is valid
  if (folder === 'stock' || folder === 'pstock') {
    // Create the file in the selected folder
    fs.writeFile(`${folder}/${fileName}`, '', err => {
      if (err) {
        res.send(`Error creating file: ${err}`);
      } else {
        res.send('File created successfully');
      }
    });
  } else {
    res.send('Invalid folder selection');
  }
});



// Handle the file rename request
app.post('/rename', requireLogin, (req, res) => {
  const folder = req.body.folder;
  const oldFileName = req.body.oldFileName;
  const newFileName = req.body.newFileName;

  const oldFilePath = `${folder}/${oldFileName}`;
  const newFilePath = `${folder}/${newFileName}`;

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      res.status(500).send(`Error renaming file: ${err}`);
    } else {
      res.send('File renamed successfully');
    }
  });
});

// Handle the file delete request
app.post('/delete', requireLogin, (req, res) => {
  const folder = req.body.folder;
  const fileName = req.body.fileName;
  const filePath = `${folder}/${fileName}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send(`Error deleting file: ${err}`);
    } else {
      res.send('File deleted successfully');
    }
  });
});


// Serve the file editor page with the selected file
app.get('/edit/:folder/:filename', requireLogin, (req, res) => {
    const folder = req.params.folder;
    const filename = req.params.filename;
    const filePath = `${folder}/${filename}`;
  
    // Read the content of the selected file
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        res.send(`Error reading file: ${err}`);
      } else {
        res.send(`
        <html>
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          background-color: #1f1f1f;
          color: #f2f2f2;
          margin: 0;
          padding: 0;
        }
  
        h1 {
          color: #f2f2f2;
          margin: 0;
          padding: 10px;
        }
  
        .navigation {
          background-color: #4CAF50;
          padding: 10px;
          color: white;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
  
        .navigation i {
          margin-right: 10px;
        }
  
        .navigation button {
          background-color: transparent;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
  
        .code-ide {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 90px);
        }
  
        .code-ide textarea {
          width: 600px;
          height: 400px;
          padding: 10px;
          background-color: #333333;
          color: #f2f2f2;
          border: none;
          border-radius: 4px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          resize: none;
        }
  
        input[type="submit"] {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .footer {
          background-color: #222222;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
    
        .footer-text {
          font-size: 14px;
        }
    
        .footer-link {
          color: #4CAF50;
          text-decoration: none;
          transition: color 0.3s ease;
        }
    
        .footer-link:hover {
          color: #ff9900;
        }
  
        /* Responsive styles */
        @media (max-width: 768px) {
          .code-ide textarea {
            width: 90%;
          }
        }
      </style>
    </head>
    <body>
      <div class="navigation">
        <button onclick="history.back()"><i class="fas fa-arrow-left"></i>Back</button>
        <h1><i class="fas fa-file"></i>Edit File: ${folder}/${filename}</h1>
        <i class="fas fa-moon"></i>
      </div>
      <div class="code-ide">
        <form action="/save/${folder}/${filename}" method="post">
          <textarea name="content" placeholder="File Content" required>${content}</textarea>
          <br> <!-- Add a line break here -->
          <input type="submit" value="Save">
        </form>
      </div>
      <div class="footer">
      <p class="footer-text">Made with <i class="fa fa-heart"></i> by <a class="footer-link" href="https://www.youtube.com/c/ScienceGearYT?sub_confirmation=1">ScienceGear</a></p>
      </div>
    </body>
  </html>
        `);
      }
    });
  });
  
  
  
  // Handle the file saving
  app.post('/save/:folder/:filename', requireLogin, (req, res) => {
      const folder = req.params.folder;
      const filename = req.params.filename;
      const content = req.body.content;
      const filePath = `${folder}/${filename}`;
    
      // Save the file
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          res.send(`Error saving file: ${err}`);
        } else {
          res.send(`
          <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #222;
                color: #fff;
              }
        
              h1 {
                color: #4CAF50;
              }
        
              .popup {
                opacity: 0;
                transform: scale(0);
                animation-name: fade-in;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
        
              @keyframes fade-in {
                0% {
                  opacity: 0;
                  transform: scale(0);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
        
              .popup-icon {
                font-size: 64px;
                color: #4CAF50;
                margin-bottom: 20px;
                animation-name: checkmark-animation;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
              }
        
              @keyframes checkmark-animation {
                0% {
                  opacity: 0;
                  transform: scale(0);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
        
              .popup-message {
                font-size: 24px;
                margin-bottom: 20px;
              }
        
              .popup-button {
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
                transition: background-color 0.3s ease;
              }
        
              .popup-button:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <div class="popup">
              <i class="fas fa-check-circle popup-icon"></i>
              <h1 class="popup-message">File "${folder}/${filename}" saved successfully</h1>
              <a href="/edit" class="popup-button">Back to Editor</a>
            </div>
          </body>
        </html>      
          `);
        }
      });
    });  
  
    
  
  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });