param(
  [Parameter(Position = 0)]
  [ValidateSet("page", "component")]
  [string]$Kind,

  [Parameter(Position = 1)]
  [string]$Name,

  [switch]$Validate,
  [switch]$OpenPrompt
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[migrate] $Message"
}

function To-KebabCase {
  param([string]$Value)

  $normalized = $Value.Trim()
  $normalized = $normalized -creplace "([a-z0-9])([A-Z])", '$1-$2'
  $normalized = $normalized.ToLowerInvariant() -creplace "[^a-z0-9]+", "-"
  $normalized.Trim("-")
}

function To-PascalCase {
  param([string]$Value)

  (($Value -split "-" | Where-Object { $_ }) | ForEach-Object {
    $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1)
  }) -join ""
}

function Get-RelativePathForPrompt {
  param(
    [string]$BasePath,
    [string]$Path
  )

  $resolvedProjectRoot = if ($script:projectRoot) { [string]$script:projectRoot } else { "" }
  $resolvedBasePath = [string](Resolve-Path -LiteralPath $BasePath).Path
  $resolvedPath = [string](Resolve-Path -LiteralPath $Path).Path

  if ($resolvedProjectRoot -and $resolvedPath.StartsWith($resolvedProjectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    $projectRelative = $resolvedPath.Substring($resolvedProjectRoot.Length).TrimStart("\")
    if ($projectRelative) {
      return "gaws\gaws02\$projectRelative"
    }
    return "gaws\gaws02"
  }

  $baseUri = [Uri]($resolvedBasePath.TrimEnd("\") + "\")
  $pathUri = [Uri]$resolvedPath
  [Uri]::UnescapeDataString($baseUri.MakeRelativeUri($pathUri).ToString()).Replace("/", "\")
}

if (-not $Kind -or -not $Name) {
  Write-Host "Usage: npm run migrate page employee-management"
  Write-Host "       npm run migrate component profile-card"
  Write-Host ""
  Write-Host "Options:"
  Write-Host "  -- -Validate     Run the Angular build after Copilot applies the migration."
  Write-Host "  -- -OpenPrompt   Open the generated Copilot prompt in VS Code when code CLI is available."
  exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = [string](Resolve-Path (Join-Path $scriptDir "..")).Path
$repoRoot = [string](Resolve-Path (Join-Path $projectRoot "..\..")).Path
$componentName = To-KebabCase $Name
$className = "$(To-PascalCase $componentName)Component"

$legacyRoot = Join-Path $projectRoot "client"
$angularRoot = Join-Path $projectRoot "client-ngx"
$pagesRoot = Join-Path $angularRoot "src\app\pages"
$targetRoot = Join-Path $pagesRoot $componentName
$logRoot = Join-Path $angularRoot "migration-log"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$promptPath = Join-Path $logRoot "$timestamp-$componentName-copilot-prompt.md"
$manifestPath = Join-Path $logRoot "$timestamp-$componentName-manifest.json"

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null

$sourceCandidates = @(
  (Join-Path $legacyRoot "components\$componentName\$componentName.html"),
  (Join-Path $legacyRoot "components\$componentName\$componentName.js"),
  (Join-Path $legacyRoot "components\$componentName.html"),
  (Join-Path $legacyRoot "components\$componentName.js"),
  (Join-Path $legacyRoot "$componentName.html"),
  (Join-Path $legacyRoot "$componentName.js")
)

$sourceFiles = $sourceCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -Unique
$frameworkFiles = @(
  (Join-Path $repoRoot "MIGRATION_AGENT.md"),
  (Join-Path $repoRoot "MIGRATION_INSTRUCTIONS.md"),
  (Join-Path $repoRoot "FRAMEWORK_OVERVIEW.md"),
  (Join-Path $repoRoot "gaws\.agents\angularjs-analyzer.md"),
  (Join-Path $repoRoot "gaws\.agents\migration-planner.md"),
  (Join-Path $repoRoot "gaws\.agents\angular-implementer.md"),
  (Join-Path $repoRoot "gaws\.agents\migration-reviewer.md"),
  (Join-Path $repoRoot "gaws\.codex\skills\gaws-component-migration\SKILL.md"),
  (Join-Path $repoRoot "gaws\.codex\skills\gaws-component-migration\references\migration-checklist.md")
) | Where-Object { Test-Path -LiteralPath $_ }

$alwaysReadFiles = @(
  (Join-Path $legacyRoot "init.js"),
  (Join-Path $legacyRoot "index.html"),
  (Join-Path $angularRoot "src\app\app.routes.ts"),
  (Join-Path $angularRoot "src\app\app.config.ts"),
  (Join-Path $angularRoot "package.json"),
  (Join-Path $angularRoot "angular.json"),
  (Join-Path $projectRoot "backend\server.js")
) | Where-Object { Test-Path -LiteralPath $_ }

$missingTemplate = $true
foreach ($file in $sourceFiles) {
  if ([IO.Path]::GetExtension($file) -eq ".html") {
    $missingTemplate = $false
  }
}

$warnings = New-Object System.Collections.Generic.List[string]
if ($sourceFiles.Count -eq 0) {
  $warnings.Add("No AngularJS source file was found for '$componentName'.")
}
if ($missingTemplate) {
  $warnings.Add("No legacy HTML template was found for '$componentName'. Check route templateUrl and source tree before claiming migration parity.")
}

$routeFile = Join-Path $legacyRoot "init.js"
if (Test-Path -LiteralPath $routeFile) {
  $routeText = Get-Content -LiteralPath $routeFile -Raw
  if ($routeText -match [regex]::Escape("/$componentName")) {
    $routeFound = $true
  } else {
    $routeFound = $false
    $warnings.Add("No AngularJS route containing '/$componentName' was detected in client/init.js.")
  }
} else {
  $routeFound = $false
}

$promptFiles = @()
$promptFiles += $frameworkFiles
$promptFiles += $alwaysReadFiles
$promptFiles += $sourceFiles
$promptFiles = $promptFiles | Select-Object -Unique

$fileReferenceLines = $promptFiles | ForEach-Object {
  "- " + (Get-RelativePathForPrompt -BasePath $repoRoot -Path $_)
}

$sourceReferenceLines = if ($sourceFiles.Count -gt 0) {
  $sourceFiles | ForEach-Object { "- " + (Get-RelativePathForPrompt -BasePath $repoRoot -Path $_) }
} else {
  "- No source files discovered."
}

$warningLines = if ($warnings.Count -gt 0) {
  $warnings | ForEach-Object { "- WARNING: $_" }
} else {
  "- None"
}

$prompt = @"
# GitHub Copilot Agent Task: Migrate $componentName

You are migrating one GAWS AngularJS $Kind into the Angular 20 client.

## Command That Created This Task

````powershell
npm run migrate $Kind $componentName
````

## Migration Unit

- Type: $Kind
- Name: $componentName
- Angular class: $className
- Legacy route detected: $routeFound
- Angular target folder: gaws\gaws02\client-ngx\src\app\pages\$componentName

## Blocking Warnings To Resolve Before Claiming Completion

$($warningLines -join "`r`n")

## Source Files

$($sourceReferenceLines -join "`r`n")

## Required Context Files

$($fileReferenceLines -join "`r`n")

## Instructions

1. Read the required context files before editing.
2. Read every discovered AngularJS source file and any services, filters, directives, styles, or assets referenced by it.
3. If the AngularJS route references a missing template or script, stop and record the mismatch instead of inventing UI.
4. Migrate the unit into `gaws/gaws02/client-ngx/src/app/pages/$componentName`.
5. Prefer standalone Angular components, `ChangeDetectionStrategy.OnPush`, typed services, typed DTOs, and Reactive Forms for non-trivial forms.
6. Preserve visible behavior, user-facing text, route behavior, API endpoints, validation, alerts, loading states, filtering, sorting, pagination, modals, and CSS class behavior.
7. Reuse existing Angular conventions and shared components/styles before creating new abstractions.
8. Wire the route in `gaws/gaws02/client-ngx/src/app/app.routes.ts` when this is page-level.
9. Add focused tests when migrated logic has branching, validation, transformation, or service contracts.
10. Run `npm --prefix gaws/gaws02/client-ngx run build` after implementing, and report any skipped validation or remaining gaps.

## Expected Output

- Angular component/page files created or updated under `client-ngx/src/app`.
- Directly required services, models, routes, tests, and styles updated.
- A short migration log entry under `client-ngx/migration-log`.
- Build validation result, or a clear reason validation was skipped.
"@

Set-Content -LiteralPath $promptPath -Value $prompt -Encoding UTF8

$manifest = [ordered]@{
  command = "npm run migrate $Kind $componentName"
  kind = $Kind
  name = $componentName
  className = $className
  targetRoot = (Get-RelativePathForPrompt -BasePath $repoRoot -Path $targetRoot)
  promptPath = (Get-RelativePathForPrompt -BasePath $repoRoot -Path $promptPath)
  sourceFiles = @($sourceFiles | ForEach-Object { Get-RelativePathForPrompt -BasePath $repoRoot -Path $_ })
  contextFiles = @($promptFiles | ForEach-Object { Get-RelativePathForPrompt -BasePath $repoRoot -Path $_ })
  warnings = @($warnings)
  createdAt = (Get-Date).ToString("o")
}

$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Step "Prepared migration workspace for '$componentName'."
Write-Step "Target folder: $(Get-RelativePathForPrompt -BasePath $repoRoot -Path $targetRoot)"
Write-Step "Copilot prompt: $(Get-RelativePathForPrompt -BasePath $repoRoot -Path $promptPath)"
Write-Step "Manifest: $(Get-RelativePathForPrompt -BasePath $repoRoot -Path $manifestPath)"

if ($warnings.Count -gt 0) {
  Write-Host ""
  Write-Host "Warnings:"
  $warnings | ForEach-Object { Write-Host " - $_" }
}

$codeCommand = Get-Command code -ErrorAction SilentlyContinue
if ($OpenPrompt -and $codeCommand) {
  Write-Step "Opening the Copilot prompt in VS Code."
  & code $promptPath
} elseif ($OpenPrompt) {
  Write-Step "VS Code 'code' CLI was not found. Open the prompt file manually."
}

Write-Host ""
Write-Host "Next step for GitHub Copilot:"
Write-Host "1. Open the prompt file above."
Write-Host "2. Paste it into Copilot Chat/Agent with this workspace open."
Write-Host "3. Let Copilot apply the migration edits."
Write-Host "4. Run: npm run migrate $Kind $componentName -- -Validate"

if ($Validate) {
  Write-Host ""
  Write-Step "Running Angular build validation."
  npm --prefix $angularRoot run build
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Angular build validation failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
  }
}
