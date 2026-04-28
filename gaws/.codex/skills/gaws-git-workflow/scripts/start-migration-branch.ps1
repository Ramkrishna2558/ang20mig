param(
  [Parameter(Mandatory = $true)]
  [string]$Ticket,

  [Parameter(Mandatory = $true)]
  [string]$Component
)

$ticketSlug = $Ticket.Trim().ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$componentSlug = $Component.Trim().ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$branch = "migration/$ticketSlug/$componentSlug-to-angular"

git switch -c $branch
