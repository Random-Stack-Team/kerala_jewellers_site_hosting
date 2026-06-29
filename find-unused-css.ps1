# PowerShell script to find unused CSS selectors
# Focus on class selectors only

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

$htmlFiles = @()
$htmlFiles += Get-ChildItem -Path "." -Filter "*.html" -Recurse | Where-Object { $_.DirectoryName -notlike "*\css*" -and $_.DirectoryName -notlike "*\js*" -and $_.DirectoryName -notlike "*\data*" }
$htmlFiles += Get-ChildItem -Path ".\goldproducts" -Filter "*.html" -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\silverproducts" -Filter "*.html" -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\diamondproducts" -Filter "*.html" -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\post" -Filter "*.html" -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path ".\partials" -Filter "*.html" -ErrorAction SilentlyContinue

# Combine all HTML content for searching
$htmlContent = ""
foreach ($file in $htmlFiles) {
    $htmlContent += (Get-Content -Path $file.FullName -Raw) + "`n"
}

# Function to extract class selectors from CSS
function Get-ClassSelectors {
    param([string]$cssContent)
    
    $selectors = @()
    $lines = $cssContent -split "`n"
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i].Trim()
        
        # Skip comments and empty lines
        if ($line -match '^\s*/\*' -or $line -match '^\s*\*/' -or $line -match '^\s*$') {
            continue
        }
        
        # Remove comments from the line
        $line = $line -replace '/\*.*?\*/', ''
        
        # Match class selectors (word characters, hyphens, underscores)
        # Handle multiple selectors on one line
        if ($line -match '\.[a-zA-Z_-][a-zA-Z0-9_-]*') {
            $matches = [regex]::Matches($line, '\.[a-zA-Z_-][a-zA-Z0-9_-]*')
            foreach ($match in $matches) {
                $className = $match.Value.Substring(1) # Remove the leading dot
                $selectors += @{
                    Selector = $className
                    Line = $i + 1
                    LineContent = $lines[$i].Trim()
                }
            }
        }
    }
    
    return $selectors
}

# Process each CSS file and find unused selectors
$allUnusedSelectors = @()

foreach ($cssFile in $cssFiles) {
    $fullPath = "E:\Kerala-Jewellers-final\$cssFile"
    if (Test-Path $fullPath) {
        $cssContent = Get-Content -Path $fullPath -Raw
        $classSelectors = Get-ClassSelectors -cssContent $cssContent
        
        Write-Host "Processing $cssFile - Found $($classSelectors.Count) class selectors" -ForegroundColor Cyan
        
        foreach ($selector in $classSelectors) {
            $className = $selector.Selector
            $lineNum = $selector.Line
            $lineContent = $selector.LineContent
            
            # Check if class name appears in any HTML file's class attribute
            # We search for the class name in class="..." or class='...' attributes
            $pattern = "class\s*=\s*[""'].*?$className.*?[""']"
            
            if (-not ($htmlContent -match $pattern)) {
                $allUnusedSelectors += @{
                    File = $cssFile
                    Selector = ".$className"
                    Line = $lineNum
                    LineContent = $lineContent
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
            Occurrences = $_.Group | ForEach-Object {
                "$($_.File):$($_.Line) - $($_.LineContent)"
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

# Also check for specific Webflow patterns mentioned by user
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
    
    # Check in CSS
    $inCSS = $allUnusedSelectors | Where-Object { $_.Selector -match $pattern }
    $inHTML = $htmlContent -match $pattern
    
    Write-Host "`n$pattern ($description):" -ForegroundColor Cyan
    Write-Host "  In CSS: $($inCSS.Count) occurrences" -ForegroundColor $(if ($inCSS.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "  In HTML: $(if ($inHTML) { 'Yes' } else { 'No'})" -ForegroundColor $(if ($inHTML) { "Green" } else { "Red" })
    
    if ($inCSS.Count -gt 0) {
        foreach ($sel in $inCSS) {
            Write-Host "    - $($sel.File):$($sel.Line)" -ForegroundColor Gray
        }
    }
}

Write-Host "`n" + "="*80 -ForegroundColor Yellow
Write-Host "SUMMARY" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Yellow
Write-Host "Total unused class selectors found: $($allUnusedSelectors.Count)" -ForegroundColor White
Write-Host "Total unique selectors: $($groupedSelectors.Count)" -ForegroundColor White