$lines = [System.IO.File]::ReadAllLines("E:\Kerala-Jewellers-final\css\pages.css")

# Find all top-level @media blocks
$braceDepth = 0
$inBlock = $false
$selectorLines = @()
$currentSelector = ""
$blockStart = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    if ($inBlock) {
        foreach ($ch in $line.ToCharArray()) {
            if ($ch -eq '{') { $braceDepth++ }
            elseif ($ch -eq '}') { $braceDepth-- }
        }
        if ($braceDepth -eq 0) {
            Write-Host "Block ended: selector='$currentSelector' lines $blockStart-$i isMedia=$($currentSelector -match '^\s*@media')"
            $inBlock = $false
            $currentSelector = ""
            $selectorLines = @()
        }
    }
    else {
        if ($line -match '\{') {
            $beforeBrace = ($line -split '\{', 2)[0].Trim()
            $allParts = @()
            if ($selectorLines.Count -gt 0) { $allParts += $selectorLines }
            if ($beforeBrace -ne "") { $allParts += $beforeBrace }
            $currentSelector = ($allParts -join ' ').Trim()
            $blockStart = $i
            $inBlock = $true
            $braceDepth = 0
            foreach ($ch in $line.ToCharArray()) {
                if ($ch -eq '{') { $braceDepth++ }
                elseif ($ch -eq '}') { $braceDepth-- }
            }
            if ($braceDepth -eq 0) {
                Write-Host "Single-line: selector='$currentSelector' line $i isMedia=$($currentSelector -match '^\s*@media')"
                $inBlock = $false
                $currentSelector = ""
                $selectorLines = @()
            }
        }
        elseif ($line.Trim() -ne "") {
            $selectorLines += $line.Trim()
        }
    }
}
