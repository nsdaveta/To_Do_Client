Add-Type -AssemblyName System.Drawing
$p = 'C:\Users\nsdav\OneDrive\Desktop\MERN STACK\To_Do_List\To_Do_Client\public\logo.png'
$p2 = 'C:\Users\nsdav\OneDrive\Desktop\MERN STACK\To_Do_List\To_Do_Client\public\logo_fixed.png'
$img = [System.Drawing.Image]::FromFile($p)
$img.Save($p2, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()

$p = 'C:\Users\nsdav\OneDrive\Desktop\MERN STACK\To_Do_List\To_Do_Client\public\screenshot.png'
$p2 = 'C:\Users\nsdav\OneDrive\Desktop\MERN STACK\To_Do_List\To_Do_Client\public\screenshot_fixed.png'
$img = [System.Drawing.Image]::FromFile($p)
$img.Save($p2, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
