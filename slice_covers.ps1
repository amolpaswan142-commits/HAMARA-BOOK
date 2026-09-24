Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Amol\.gemini\antigravity\brain\fbd82c85-7492-4196-addf-a830b90605d7\.user_uploaded\media_1790016600642.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = $img.Width
$h = $img.Height
Write-Host "Image Width: $w, Height: $h"

# 4 columns, 2 rows
$colW = [int]($w / 4)
$rowH = [int]($h / 2)

Write-Host "Each book cover cell: Width $colW, Height $rowH"

$destDir = "C:\Users\Amol\.gemini\antigravity\scratch\hamara-book\assets\covers"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$names = @(
    @("art-design-creative-expression.jpg", "basic-economics.jpg", "complete-biology.jpg", "computer-basics.jpg"),
    @("english-communication.jpg", "essential-physics.jpg", "health-yoga.jpg", "hindi-literature.jpg")
)

for ($row = 0; $row -lt 2; $row++) {
    for ($col = 0; $col -lt 4; $col++) {
        $x = $col * $colW
        $y = $row * $rowH
        
        # Adjust width & height to avoid bounds overflow
        $cw = [Math]::Min($colW, $w - $x)
        $ch = [Math]::Min($rowH, $h - $y)
        
        $cropRect = New-Object System.Drawing.Rectangle($x, $y, $cw, $ch)
        $cropped = $img.Clone($cropRect, $img.PixelFormat)
        
        $fileName = $names[$row][$col]
        $outPath = Join-Path $destDir $fileName
        $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $cropped.Dispose()
        Write-Host "Saved: $fileName ($cw x $ch)"
    }
}

$img.Dispose()
Write-Host "All 8 covers extracted successfully!"
