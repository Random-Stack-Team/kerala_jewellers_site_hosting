# Faster PowerShell script to find unused CSS selectors
$ErrorActionPreference = "SilentlyContinue"

$cssFiles = @(
    "css\base.css",
    "css\layout.css", 
    "css\components.css",
    "css\header.css",
    "css\desktop.css",
    "css\overrides.css",
    "css\pages.css",
    "css\navbar.css",
    "css\responsive.css"
)

# Get all HTML files more efficiently
$htmlFiles = @()
$htmlFiles += Get-ChildItem -Path "." -Filter "*.html" -File
$htmlFiles += Get-ChildItem -Path ".\goldproducts" -Filter "*.html" -File -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\silverproducts" -Filter "*.html" -File -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\diamondproducts" -Filter "*.html" -File -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\post" -Filter "*.html" -File -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\partials" -Filter "*.html" -File -ErrorAction SilentlyContinue

# Read all HTML files and extract all class names
$allClassNames = @()
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    # Extract all class="..." values
    $matches = [regex]::Matches($content, 'class\s*=\s*["'']([^"'']*)["'']')
    foreach ($m in $matches) {
        $classAttr = $m.Groups[1].Value
        # Split by spaces to get individual classes
        $classes = $classAttr -split '\s+'
        $allClassNames += $classes
    }
}

# Convert to HashSet for fast lookup
$classHashSet = New-Object System.Collections.Generic.HashSet[string]
foreach ($className in $allClassNames) {
    if (-not [string]::IsNullOrWhiteSpace($className)) {
        [void]$classHashSet.Add($className.Trim().ToLower())
    }
}

Write-Host "Found $($classHashSet.Count) unique class names in HTML files" -ForegroundColor Green

# Process each CSS file
$allUnusedSelectors = @()

foreach ($cssFile in $cssFiles) {
    $fullPath = "E:\Kerala-Jewellers-final\$cssFile"
    if (Test-Path $fullPath) {
        $lines = Get-Content -Path $fullPath
        Write-Host "Processing $cssFile..." -ForegroundColor Cyan
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            
            # Skip comments and empty lines
            if ($line -match '^\s*/\*' -or $line -match '^\s*\*/' -or $line -match '^\s*$') {
                continue
            }
            
            # Extract class selectors from the line
            $matches = [regex]::Matches($line, '\.([a-zA-Z_-][a-zA-Z0-9_-]*)')
            foreach ($match in $matches) {
                $className = $match.Groups[1].Value.ToLower()
                
                # Check if class exists in HTML files
                if (-not $classHashSet.Contains($className)) {
                    $allUnusedSelectors += @{
                        File = $cssFile
                        Selector = ".$className"
                        Line = $i + 1
                        LineContent = $line.Trim()
                    }
                }
            }
        }
    }
}

# Group by selector and count occurrences
$groupedSelectors = $allUnusedSelectors | Group-Object -Property Selector | 
    ForEach-Object {
        @{
            Selector = $_.Name
            Count = $_.Count
            Occurrences = $_.Group | Select-Object -First 5 | ForEach-Object {
                "$($_.File):$($_.Line) - $($_.LineContent.Substring(0, [Math]::Min(80, $_.LineContent.Length)))"
            }
        }
    } | Sort-Object { $_.Count } -Descending

# Display top 30 most common dead selectors
Write-Host "`n" + "="*80 -ForegroundColor Yellow
Write-Host "TOP 30 MOST COMMON UNUSED CSS SELECTORS" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Yellow

$counter = 0
foreach ($group in $groupedSelectors[0..29]) {
    $counter++
    Write-Host "`n$counter. $($group.Selector) (Found in $($group.Count) CSS rules)" -ForegroundColor Red
    foreach ($occurrence in $group.Occurrences) {
        Write-Host "   - $occurrence" -ForegroundColor Gray
    }
}

# Webflow pattern analysis
Write-Host "`n" + "="*80 -ForegroundColor Yellow
Write-Host "WEBFLOW PATTERN ANALYSIS" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Yellow

$webflowPatterns = @(
    @{Pattern = "w-layout-grid"; Description = "Webflow layout grid"},
    @{Pattern = "w-condition-invisible"; Description = "Webflow conditional"},
    @{Pattern = "w-variant-"; Description = "Webflow variants"},
    @{Pattern = "form-done"; Description = "Webflow form success state"},
    @{Pattern = "form-error"; Description = "Webflow form error state"},
    @{Pattern = "section-"; Description = "Generic section patterns"},
    @{Pattern = "collection-item-"; Description = "Collection item patterns"}
)

foreach ($webflow in $webflowPatterns) {
    $pattern = $webflow.Pattern
    $description = $webflow.Description
    
    # Check in CSS (unused selectors)
    $inCSS = $allUnusedSelectors | Where-Object { $_.Selector -match $pattern }
    # Check in HTML
    $inHTML = $classHashSet | Where-Object { $_ -match $pattern }
    
    Write-Host "`n.$pattern ($description):" -ForegroundColor Cyan
    Write-Host "  In CSS (unused): $($inCSS.Count) occurrences" -ForegroundColor $(if ($inCSS.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "  In HTML (used): $(if ($inHTML) { 'Yes' } else { 'No'})" -ForegroundColor $(if ($inHTML) { "Green" } else { "Red" })
    
    if ($inCSS.Count -gt 0) {
        foreach ($sel in $inCSS[0..4]) {
            Write-Host "    - $($sel.File):$($sel.Line)" -ForegroundColor Gray
        }
        if ($inCSS.Count -gt 5) {
            Write-Host "    ... and $($inCSS.Count - 5) more" -ForegroundColor Gray
        }
    }
}

# Summary
Write-Host "`n" + "="*80 -ForegroundColor Yellow
Write-Host "SUMMARY" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Yellow
Write-Host "Total unused class selectors found: $($allUnusedSelectors.Count)" -ForegroundColor White
Write-Host "Total unique selectors: $($groupedSelectors.Count)" -ForegroundColor White

# Output to file for easy reading
$outputFile = "E:\Kerala-Jewellers-final\unused-css-report.txt"
"UNUSED CSS SELECTORS REPORT" | Out-File $outputFile
"Generated: $(Get-Date)" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append
"TOP 30 MOST COMMON UNUSED CSS SELECTORS:" | Out-File $outputFile -Append
"-" * 80 | Out-File $outputFile -Append

$counter = 0
foreach ($group in $groupedSelectors[0..29]) {
    $counter++
    "`n$counter. $($group.Selector) (Found in $($group.Count) CSS rules)" | Out-File $outputFile -Append
    foreach ($occurrence in $group.Occurrences) {
        "   - $occurrence" | Out-File $outputFile -Append
    }
}

"`n`nWEBFLOW PATTERN ANALYSIS:" | Out-File $outputFile -Append
"-" * 80 | Out-File $outputFile -Append

foreach ($webflow in $webflowPatterns) {
    $pattern = $webflow.Pattern
    $description = $webflow.Description
    
    $inCSS = $allUnusedSelectors | Where-Object { $_.Selector -match $pattern }
    $inHTML = $classHashSet | Where-Object { $_ -match $pattern }
    
    "`n.$pattern ($description):" | Out-File $outputFile -Append
    "  In CSS (unused): $($inCSS.Count) occurrences" | Out-File $outputFile -Append
    "  In HTML (used): $(if ($inHTML) { 'Yes' } else { 'No'})" | Out-File $outputFile -Append
    
    if ($inCSS.Count -gt 0) {
        foreach ($sel in $inCSS) {
            "    - $($sel.File):$($sel.Line)" | Out-File $outputFile -Append
        }
    }
}

"`n`nSUMMARY:" | Out-File $outputFile -Append
"-" * 80 | Out-File $outputFile -Append
"Total unused class selectors found: $($allUnusedSelectors.Count)" | Out-File $outputFile -Append
"Total unique selectors: $($groupedSelectors.Count)" | Out-File $outputFile -Append

Write-Host "`nReport saved to: $outputFile" -ForegroundColor Green