<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>.gitattributes perfeccionado</title>
  <style>
    body {
      margin: 0;
      background: #0f1117;
      color: #f5f5f5;
      font-family: Arial, sans-serif;
      padding: 40px;
    }
    .container {
      max-width: 960px;
      margin: auto;
      background: #171a23;
      border: 1px solid #2a2f3a;
      border-radius: 18px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35);
    }
    h1 {
      margin-top: 0;
      font-size: 28px;
    }
    p {
      color: #b8beca;
      line-height: 1.6;
    }
    pre {
      background: #090b10;
      color: #d8dee9;
      padding: 24px;
      border-radius: 14px;
      overflow-x: auto;
      font-size: 15px;
      line-height: 1.6;
      border: 1px solid #2a2f3a;
    }
    .note {
      background: #242936;
      border-left: 5px solid #ff7a1a;
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <main class="container">
    <h1>.gitattributes perfeccionado</h1>
    <div class="note">
    </div>
    <pre><code># Normalize line endings across operating systems
* text=auto eol=lf

# Windows scripts should keep CRLF
*.bat text eol=crlf
*.cmd text eol=crlf

# Shell scripts should keep LF
*.sh text eol=lf

# Source code and config files
*.js   text eol=lf
*.jsx  text eol=lf
*.ts   text eol=lf
*.tsx  text eol=lf
*.json text eol=lf
*.css  text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md   text eol=lf
*.yml  text eol=lf
*.yaml text eol=lf
*.env.example text eol=lf

# Images
*.png  binary
*.jpg  binary
*.jpeg binary
*.gif  binary
*.webp binary
*.ico  binary
*.svg  text eol=lf

# Fonts
*.ttf   binary
*.otf   binary
*.woff  binary
*.woff2 binary

# Documents and compressed files
*.pdf  binary
*.zip  binary
*.rar  binary
*.7z   binary
*.tar  binary
*.gz   binary

# Audio and video
*.mp3  binary
*.wav  binary
*.mp4  binary
*.mov  binary
*.avi  binary
*.webm binary

# Executables and databases
*.exe binary
*.dll binary
*.so  binary
*.dylib binary
*.db  binary
*.sqlite binary
</code></pre>
  </main>
</body>
</html># CRM
