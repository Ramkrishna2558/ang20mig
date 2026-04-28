param(
  [Parameter(Mandatory = $true)]
  [string]$Name,

  [string]$Root = "gaws/gaws02/client-ngx/src/app/pages"
)

$componentName = $Name.Trim().ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$target = Join-Path $Root $componentName

New-Item -ItemType Directory -Force -Path $target | Out-Null

$className = ($componentName -split "-" | ForEach-Object {
  if ($_.Length -eq 0) { return "" }
  $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1)
}) -join ""

@{
  component = $componentName
  class = "$className`Component"
  path = $target
}
