Add-Type -AssemblyName System.Drawing

$destDir = "C:\Users\Amol\.gemini\antigravity\scratch\hamara-book\assets\covers"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# 1. Copy 4 Popular Book Covers
$popCovers = @{
    "media_1790070767768.png" = "the-kite-runner.png"
    "media_1790070767783.png" = "the-7-habits.png"
    "media_1790070767806.png" = "rich-dad-poor-dad.png"
    "media_1790070767811.jpg" = "pride-and-prejudice.jpg"
}

$uploadDir = "C:\Users\Amol\.gemini\antigravity\brain\fbd82c85-7492-4196-addf-a830b90605d7\.user_uploaded"

foreach ($k in $popCovers.Keys) {
    $src = Join-Path $uploadDir $k
    $dst = Join-Path $destDir $popCovers[$k]
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Copied Popular cover: $($popCovers[$k])"
    } else {
        Write-Host "Warning: File not found: $src"
    }
}

# 2. Slice the 3x5 IT Covers Grid
$itGridFile = Join-Path $uploadDir "media_1790070785180.jpg"
if (Test-Path $itGridFile) {
    $img = [System.Drawing.Bitmap]::FromFile($itGridFile)
    $w = $img.Width
    $h = $img.Height
    Write-Host "IT Grid Image Dimensions: Width $w x Height $h"

    # 5 columns, 3 rows
    $colW = [int]($w / 5)
    $rowH = [int]($h / 3)
    Write-Host "Single IT cover cell: Width $colW x Height $rowH"

    # Row 0: AI, Blockchain, Networks, Cybersecurity, DSA
    # Row 1: DevOps, ML Engineering, Flutter, NLP, SRE
    # Row 2: Software Architecture, UX Design, Kubernetes, MERN, Python
    $itFileNames = @(
        @("ai-generative-models.jpg", "blockchain-distributed.jpg", "computer-networks.jpg", "cybersecurity-fundamentals.jpg", "data-structures-algorithms.jpg"),
        @("devops-continuous-delivery.jpg", "machine-learning-engineering.jpg", "mobile-app-flutter.jpg", "natural-language-processing.jpg", "site-reliability-engineering.jpg"),
        @("software-architecture-patterns.jpg", "ux-design-hci.jpg", "cloud-native-kubernetes.jpg", "fullstack-mern-nextjs.jpg", "python-data-science.jpg")
    )

    for ($row = 0; $row -lt 3; $row++) {
        for ($col = 0; $col -lt 5; $col++) {
            $x = $col * $colW
            $y = $row * $rowH

            $cw = [Math]::Min($colW, $w - $x)
            $ch = [Math]::Min($rowH, $h - $y)

            $cropRect = New-Object System.Drawing.Rectangle($x, $y, $cw, $ch)
            $cropped = $img.Clone($cropRect, $img.PixelFormat)

            $fileName = $itFileNames[$row][$col]
            $outPath = Join-Path $destDir $fileName
            $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $cropped.Dispose()
            Write-Host "Saved IT Cover: $fileName ($cw x $ch)"
        }
    }

    $img.Dispose()
    Write-Host "Successfully sliced and saved all 15 IT Book Covers!"
} else {
    Write-Host "Error: IT Grid file not found: $itGridFile"
}
