# More robust CSS unused selector finder
$ErrorActionPreference = "SilentlyContinue"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "E:\Kerala-Jewellers-final" -Filter "*.html" -Recurse | 
    Where-Object { $_.DirectoryName -notmatch "(css|js|data|\.git)" }

# Extract all class names from HTML
$allClasses = @()
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        # Match class="..." or class='...'
        $matches = [regex]::Matches($content, 'class\s*=\s*["'']([^"'']*)["'']')
        foreach ($m in $matches) {
            $classes = $m.Groups[1].Value -split '\s+'
            $allClasses += $classes | Where-Object { $_ -match '^[a-zA-Z_-]' }
        }
    }
}

# Create unique set of class names (lowercase for case-insensitive comparison)
$uniqueClasses = $allClasses | ForEach-Object { $_.ToLower() } | Sort-Object -Unique
Write-Host "Found $($uniqueClasses.Count) unique class names in HTML files" -ForegroundColor Green

# CSS files to analyze
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

$unusedSelectors = @()

foreach ($cssFile in $cssFiles) {
    $fullPath = Join-Path "E:\Kerala-Jewellers-final" $cssFile
    Write-Host "Processing $cssFile..." -ForegroundColor Cyan
    
    $lines = Get-Content -Path $fullPath -ErrorAction SilentlyContinue
    if (-not $lines) { continue }
    
    $inComment = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Handle multi-line comments
        if ($line -match '/\*') { $inComment = $true }
        if ($line -match '\*/') { $inComment = $false; continue }
        if ($inComment) { continue }
        
        # Remove single-line comments
        $line = $line -replace '//.*$', ''
        $line = $line -replace '/\*.*?\*/', ''
        
        # Skip empty lines
        if ($line -match '^\s*$') { continue }
        
        # Extract class selectors (.className)
        $selectorMatches = [regex]::Matches($line, '\.([a-zA-Z_-][a-zA-Z0-9_-]*)')
        foreach ($match in $selectorMatches) {
            $className = $match.Groups[1].Value.ToLower()
            
            # Check if class exists in HTML
            if ($uniqueClasses -notcontains $className) {
                $unusedSelectors += [PSCustomObject]@{
                    File = $cssFile
                    Selector = ".$className"
                    Line = $i + 1
                    LineContent = $line.Trim().Substring(0, [Math]::Min(100, $line.Trim().Length))
                }
            }
        }
    }
}

# Group and sort by frequency
$grouped = $unusedSelectors | Group-Object Selector | 
    Select-Object Name, Count, @{N='Examples';E={$_.Group | Select-Object -First 3 | ForEach-Object { "$($_.File):$($_.Line)" }}} |
    Sort-Object Count -Descending

# Display results
Write-Host "`n" + ("=" * 80) -ForegroundColor Yellow
Write-Host "TOP 30 MOST COMMON UNUSED CSS CLASS SELECTORS" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Yellow

$counter = 0
foreach ($item in ($grouped | Select-Object -First 30)) {
    $counter++
    Write-Host "`n$counter. $($item.Name)" -ForegroundColor Red
    Write-Host "   Count: $($item.Count) occurrences" -ForegroundColor Gray
    Write-Host "   Examples:" -ForegroundColor Gray
    foreach ($ex in $item.Examples) {
        Write-Host "     - $ex" -ForegroundColor DarkGray
    }
}

# Webflow analysis
Write-Host "`n" + ("=" * 80) -ForegroundColor Yellow
Write-Host "WEBFLOW PATTERN ANALYSIS" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Yellow

$webflowChecks = @(
    @{Selector="w-layout-grid"; Desc="Webflow layout grid"},
    @{Selector="w-condition-invisible"; Desc="Webflow conditional"},
    @{Selector="w-variant"; Desc="Webflow variants"},
    @{Selector="form-done"; Desc="Webflow form success"},
    @{Selector="form-error"; Desc="Webflow form error"},
    @{Selector="section-hero"; Desc="Section hero"},
    @{Selector="section-footer"; Desc="Section footer"},
    @{Selector="section-header"; Desc="Section header"},
    @{Selector="collection-item"; Desc="Collection items"}
)

foreach ($check in $webflowChecks) {
    $sel = $check.Selector
    $inCss = $unusedSelectors | Where-Object { $_.Selector -match $sel }
    $inHtml = $uniqueClasses | Where-Object { $_ -match $sel }
    
    Write-Host "`n.$sel ($($check.Desc)):" -ForegroundColor Cyan
    Write-Host "  CSS rules with this pattern: $($inCss.Count)" -ForegroundColor $(if ($inCss.Count -gt 0) {"Red"} else {"Green"})
    Write-Host "  Used in HTML: $(if ($inHtml) {'Yes'} else {'No'})" -ForegroundColor $(if ($inHtml) {"Green"} else {"Red"})
    
    if ($inCss.Count -gt 0) {
        $inCss | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $($_.File):$($_.Line)" -ForegroundColor DarkGray
        }
    }
}

# Summary
Write-Host "`n" + ("=" * 80) -ForegroundColor Yellow
Write-Host "SUMMARY" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host "Total unused class selectors: $($unusedSelectors.Count)" -ForegroundColor White
Write-Host "Unique unused selectors: $($grouped.Count)" -ForegroundColor White