$root = "E:\Kerala-Jewellers-final"
$cssDir = "$root\css"

$jsGenerated = @(
    'swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next',
    'is-open', 'is-active', 'is-current',
    'kj-banner2-gallery', 'kj-banner2-slide',
    'collection-toolbar', 'collection-toolbar__select', 'collection-toolbar__reset',
    'cc-homepage-3',
    'form-done', 'w-layout-grid',
    'swiper-slide', 'swiper-wrapper', 'swiper-button-next', 'swiper-button-prev',
    'swiper-pagination-bullet', 'swiper-pagination-bullet-active',
    'active', 'open', 'show', 'hide', 'hidden', 'visible', 'disabled',
    'menu-open', 'nav-open', 'modal-open',
    'w-tab-active', 'w--current', 'w--tab-active',
    'w-dyn-item', 'w-dyn-list', 'w-dyn-empty',
    'w-lightbox-active', 'w-lightbox-open',
    'w-slider-dot-active',
    'w-nav-overlay', 'w-nav-overlay--open',
    'product-lightbox', 'kj-zoom-lens', 'cc-quick-view'
)

$confirmedDead = @(
    'navigation-2','cc-product-detail','kj-wrapper','kj-menu','kj-selection',
    'kj-dropdown-trigger','text-field-12','kj-grid-2col','site-nav','kj-grid',
    'footer-block','product-header5_product-details','kj-dropdown-panel',
    'form-select','product-item-14','royal-blue','navigation-item','nav-overlay',
    'button-12','kj-nav-text','w-condition-invisible','form-error','section-footer'
)
$confirmedDeadPatterns = @('w-variant-', 'collection-item-')

Write-Host "=== Step 1: Collecting class names from HTML and JS files ===" -ForegroundColor Cyan

$allFiles = @()
$allFiles += Get-ChildItem -Path $root -Filter "*.html" -Recurse -File | Select-Object -ExpandProperty FullName
$allFiles += Get-ChildItem -Path $root -Filter "*.js" -Recurse -File | Select-Object -ExpandProperty FullName

$usedClasses = @{}

foreach ($file in $allFiles) {
    $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    $regex1 = New-Object System.Text.RegularExpressions.Regex 'class\s*=\s*["'']([^"'']*)["'']'
    foreach ($m in $regex1.Matches($content)) {
        $classStr = $m.Groups[1].Value
        foreach ($c in ($classStr -split '\s+')) {
            if ($c -match '^[a-zA-Z_-]') { $usedClasses[$c] = $true }
        }
    }

    $regex2 = New-Object System.Text.RegularExpressions.Regex '(?:className|addClass|classList\.(?:add|remove|toggle|contains))\s*\(["'']\s*([a-zA-Z0-9_-]+)'
    foreach ($m in $regex2.Matches($content)) {
        $usedClasses[$m.Groups[1].Value] = $true
    }

    $regex3 = New-Object System.Text.RegularExpressions.Regex '(?:querySelector(?:All)?|closest|matches)\s*\(\s*["''][#.][a-zA-Z0-9_-]+'
    foreach ($m in $regex3.Matches($content)) {
        $classMatch = [regex]::Match($m.Value, '\.([a-zA-Z0-9_-]+)')
        if ($classMatch.Success) { $usedClasses[$classMatch.Groups[1].Value] = $true }
    }

    $regex4 = New-Object System.Text.RegularExpressions.Regex '["'']\.([a-zA-Z0-9_-]+)'
    foreach ($m in $regex4.Matches($content)) {
        $usedClasses[$m.Groups[1].Value] = $true
    }
}

foreach ($c in $jsGenerated) { $usedClasses[$c] = $true }

Write-Host "Found $($usedClasses.Count) unique class names in HTML/JS files" -ForegroundColor Green

function Get-ClassNamesFromSelector {
    param([string]$selector)
    $result = @()
    foreach ($m in [regex]::Matches($selector, '\.([a-zA-Z][a-zA-Z0-9_-]*)')) {
        $result += $m.Groups[1].Value
    }
    return $result
}

function Test-SelectorShouldBeRemoved {
    param([string]$selector, $used, [string[]]$dead, [string[]]$deadPatterns)
    if ($selector -notmatch '\.[a-zA-Z]') { return $false }
    $classes = Get-ClassNamesFromSelector $selector
    foreach ($c in $classes) {
        if ($c -in $dead) { return $true }
        foreach ($pat in $deadPatterns) { if ($c -like "${pat}*") { return $true } }
    }
    if ($classes.Count -eq 0) { return $false }
    foreach ($c in $classes) {
        if ($used.ContainsKey($c)) { return $false }
    }
    return $true
}

# Process an array of CSS lines and return (outputLines, removedRules, removedLines)
function Process-CSSLines {
    param(
        [string[]]$lines,
        $used,
        [string[]]$dead,
        [string[]]$deadPatterns
    )

    $output = [System.Collections.ArrayList]@()
    $removedRules = 0
    $removedLines = 0

    # Phase 1: Parse into tokens - each token is either a complete rule or a non-rule line
    $tokens = [System.Collections.ArrayList]@()
    $i = 0

    while ($i -lt $lines.Count) {
        $line = $lines[$i]
        $trimmed = $line.Trim()

        # Empty line
        if ($trimmed -eq '') {
            [void]$tokens.Add(@{ type = 'line'; data = $line })
            $i++
            continue
        }

        # @media / @supports / @container with content
        if ($trimmed -match '^(@media|@supports|@container)\s' -and $trimmed -match '\{') {
            # Find the matching }
            $atLines = [System.Collections.ArrayList]@()
            [void]$atLines.Add($line)
            $bd = ([regex]::Matches($trimmed, '\{')).Count - ([regex]::Matches($trimmed, '\}')).Count
            $i++
            while ($i -lt $lines.Count -and $bd -gt 0) {
                $rl = $lines[$i]
                foreach ($ch in $rl.ToCharArray()) {
                    if ($ch -eq '{') { $bd++ }
                    elseif ($ch -eq '}') { $bd-- }
                }
                [void]$atLines.Add($rl)
                $i++
            }
            # Recursively process the content inside the at-rule
            if ($atLines.Count -ge 2) {
                $innerContent = $atLines[1..($atLines.Count - 2)]
                $result = Process-CSSLines $innerContent $used $dead $deadPatterns
                $innerOutput = $result.output
                $removedRules += $result.removedRules
                $removedLines += $result.removedLines
                # Rebuild: first line (the @media) + processed content + last line (closing })
                [void]$output.Add($atLines[0])
                foreach ($l in $innerOutput) { [void]$output.Add($l) }
                [void]$output.Add($atLines[$atLines.Count - 1])
            } else {
                foreach ($l in $atLines) { [void]$output.Add($l) }
            }
            continue
        }

        # Other @rules without content or with single-line content
        if ($trimmed -match '^@') {
            if ($trimmed -match '\{') {
                $atLines = [System.Collections.ArrayList]@()
                [void]$atLines.Add($line)
                $bd = ([regex]::Matches($trimmed, '\{')).Count - ([regex]::Matches($trimmed, '\}')).Count
                $i++
                while ($i -lt $lines.Count -and $bd -gt 0) {
                    $rl = $lines[$i]
                    foreach ($ch in $rl.ToCharArray()) {
                        if ($ch -eq '{') { $bd++ }
                        elseif ($ch -eq '}') { $bd-- }
                    }
                    [void]$atLines.Add($rl)
                    $i++
                }
                foreach ($l in $atLines) { [void]$output.Add($l) }
            } else {
                [void]$output.Add($line)
                $i++
            }
            continue
        }

        # Comment line
        if ($trimmed -match '^/\*') {
            [void]$output.Add($line)
            $i++
            continue
        }

        # CSS rule: collect selector lines + { line + body until }
        $selectorLines = [System.Collections.ArrayList]@()
        $foundBrace = $false

        while ($i -lt $lines.Count) {
            $cl = $lines[$i]
            $ct = $cl.Trim()

            if ($ct -eq '') { break }

            if ($ct -match '\{') {
                [void]$selectorLines.Add($cl)
                $foundBrace = $true
                $i++
                break
            }

            # Selector continuation line (has a class selector, possibly ending with comma)
            if ($ct -match '\.[a-zA-Z]' -or $ct -match '^[a-zA-Z][a-zA-Z0-9_-]*[\s,.:#>+~\[]') {
                [void]$selectorLines.Add($cl)
                $i++
                continue
            }

            break
        }

        if ($foundBrace -and $selectorLines.Count -gt 0) {
            # Build full selector text
            $fullSelText = ($selectorLines | ForEach-Object { $_.Trim() }) -join ' '
            $fullSelText = $fullSelText.Trim().TrimEnd(',').Trim()
            $lastBI = $fullSelText.LastIndexOf('{')
            if ($lastBI -gt 0) { $selector = $fullSelText.Substring(0, $lastBI).Trim() } else { $selector = $fullSelText }

            $lastSL = $selectorLines[$selectorLines.Count - 1].Trim()
            if ($lastSL -match '\}') {
                # Single-line body
                if (Test-SelectorShouldBeRemoved $selector $used $dead $deadPatterns) {
                    $removedRules++
                    $removedLines += $selectorLines.Count
                } else {
                    foreach ($l in $selectorLines) { [void]$output.Add($l) }
                }
            } else {
                # Multi-line body
                $bodyLines = [System.Collections.ArrayList]@()
                $bd = 1
                while ($i -lt $lines.Count -and $bd -gt 0) {
                    $bl = $lines[$i]
                    foreach ($ch in $bl.ToCharArray()) {
                        if ($ch -eq '{') { $bd++ }
                        elseif ($ch -eq '}') { $bd-- }
                    }
                    [void]$bodyLines.Add($bl)
                    $i++
                }
                if (Test-SelectorShouldBeRemoved $selector $used $dead $deadPatterns) {
                    $removedRules++
                    $removedLines += $selectorLines.Count + $bodyLines.Count
                } else {
                    foreach ($l in $selectorLines) { [void]$output.Add($l) }
                    foreach ($l in $bodyLines) { [void]$output.Add($l) }
                }
            }
        } else {
            [void]$output.Add($line)
            $i++
        }
    }

    return @{ output = $output; removedRules = $removedRules; removedLines = $removedLines }
}

Write-Host "`n=== Step 2: Processing CSS files ===" -ForegroundColor Cyan

$cssFiles = @("base.css", "layout.css", "components.css", "header.css", "desktop.css", "overrides.css", "pages.css", "responsive.css", "navbar.css")

$totalRemovedRules = 0
$totalRemovedLines = 0
$totalOriginalLines = 0
$totalNewLines = 0

foreach ($cssFile in $cssFiles) {
    $filePath = "$cssDir\$cssFile"
    if (-not (Test-Path $filePath)) {
        Write-Host "  Skipping $cssFile (not found)" -ForegroundColor Yellow
        continue
    }

    $lines = Get-Content $filePath
    $originalLines = $lines.Count
    $totalOriginalLines += $originalLines

    $result = Process-CSSLines $lines $usedClasses $confirmedDead $confirmedDeadPatterns
    $outputLines = $result.output
    $removedRules = $result.removedRules
    $removedLinesCount = $result.removedLines

    $newLineCount = $outputLines.Count
    $totalRemovedRules += $removedRules
    $totalRemovedLines += ($originalLines - $newLineCount)
    $totalNewLines += $newLineCount

    $color = if ($removedRules -gt 0) { "Green" } else { "Gray" }
    Write-Host "  $cssFile : removed $removedRules rules ($($originalLines - $newLineCount) lines) -> $originalLines -> $newLineCount lines" -ForegroundColor $color

    $tempFile = "$cssDir\${cssFile}.tmp"
    $outputLines | Set-Content $tempFile -Encoding UTF8
    Remove-Item $filePath -Force
    Rename-Item $tempFile $filePath
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Total CSS files processed: $($cssFiles.Count)" -ForegroundColor White
Write-Host "Original total lines: $totalOriginalLines" -ForegroundColor White
Write-Host "New total lines: $totalNewLines" -ForegroundColor White
Write-Host "Total rules removed: $totalRemovedRules" -ForegroundColor Green
Write-Host "Total lines removed: $($totalOriginalLines - $totalNewLines)" -ForegroundColor Green
$pct = [math]::Round(($totalOriginalLines - $totalNewLines) / $totalOriginalLines * 100, 1)
Write-Host "Reduction: $pct%" -ForegroundColor Green
