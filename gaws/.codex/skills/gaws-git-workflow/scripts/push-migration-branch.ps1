param(
  [Parameter(Mandatory = $true)]
  [string]$Area,

  [Parameter(Mandatory = $true)]
  [string]$Component,

  [string[]]$Paths = @("gaws/gaws02/client-ngx")
)

$areaSlug = $Area.Trim().ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$componentSlug = $Component.Trim().ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$message = "migration($areaSlug): migrate $componentSlug to Angular"

git status --short
foreach ($path in $Paths) {
  git add -- $path
}
git commit -m $message
git push -u origin HEAD
