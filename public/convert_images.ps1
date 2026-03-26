Add-Type -AssemblyName System.Drawing
function ConvertTo-Png($src, $dst) {
    $img = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
    $g.Dispose()
    $img.Dispose()
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$path = 'C:\Users\nsdav\OneDrive\Desktop\MERN STACK\To_Do_List\To_Do_Client\public'
ConvertTo-Png "$path\logo.png" "$path\logo-pwa.png"
ConvertTo-Png "$path\screenshot.png" "$path\screenshot-pwa.png"
