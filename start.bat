SET PATH=%PATH%;D:\node-v10.15.3-win-x64;C:\xampp\php;C:\xampp\mysql\bin
set DEBUG=nodegentelella:* & npm start

::taskkill /f /im node.exe
::taskkill /f /im cmd.exe
mysqldump.exe –e –u root -p -h[hostname] [database name] > C:\[filename].sql
