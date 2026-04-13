@echo off
"C:\Program Files (x86)\Windows Kits\10\App Certification Kit\signtool.exe" sign /f "c:\Users\nsdav\OneDrive\Desktop\MERN_STACK\To_Do_List\To_Do_Client\cert.pfx" /p password123 /fd sha256 %1
