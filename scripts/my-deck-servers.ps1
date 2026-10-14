<#
  my-deck : voir et arrêter les serveurs open-slide (npm run dev) de ce projet.

    my-deck-servers.ps1            menu interactif : liste, ouvrir, arrêter
    my-deck-servers.ps1 -Url       affiche l'URL du serveur actif le plus récent (code 1 si aucun)
    my-deck-servers.ps1 -StopAll   arrête tous les serveurs, sans confirmation

  Un serveur = le process node "open-slide dev" qui écoute sur un port. Pour
  l'arrêter, on tue toute sa chaîne de lancement (fenêtre du raccourci, npm,
  open-slide), jusqu'au terminal qui l'a lancé (exclu).
#>
param([switch]$Url, [switch]$StopAll)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

function Test-Contains([string]$Text, [string]$Needle) {
  return $Text -and $Text.IndexOf($Needle, [StringComparison]::OrdinalIgnoreCase) -ge 0
}

# Maillons de la chaîne de lancement : on remonte tant que le parent en fait partie.
function Test-LaunchLink($Proc) {
  $cmd = $Proc.CommandLine
  return (Test-Contains $cmd 'start-my-deck.cmd') -or
         (Test-Contains $cmd 'npm-cli.js') -or
         (Test-Contains $cmd 'open-slide dev') -or
         (Test-Contains $cmd '@open-slide\core\bin.js') -or
         ((Test-Contains $cmd 'npm') -and (Test-Contains $cmd 'run dev'))
}

function Get-MyDeckServers {
  $procs = @{}
  Get-CimInstance Win32_Process | ForEach-Object { $procs[[int]$_.ProcessId] = $_ }

  $listening = @{}
  Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    $owner = [int]$_.OwningProcess
    if (-not $listening.ContainsKey($owner)) { $listening[$owner] = [int]$_.LocalPort }
  }

  $servers = @()
  foreach ($p in $procs.Values) {
    if ($p.Name -ne 'node.exe') { continue }
    if (-not (Test-Contains $p.CommandLine '@open-slide\core\bin.js')) { continue }
    if (-not (Test-Contains $p.CommandLine $Root)) { continue }
    if (-not $listening.ContainsKey([int]$p.ProcessId)) { continue }

    # Remonte la chaîne de lancement jusqu'au premier process qui n'en fait pas partie.
    $top = $p
    $parent = $procs[[int]$top.ParentProcessId]
    while ($parent -and (Test-LaunchLink $parent)) {
      $top = $parent
      $parent = $procs[[int]$top.ParentProcessId]
    }
    if (Test-Contains $top.CommandLine 'start-my-deck.cmd') {
      $origin = 'Raccourci'
    } elseif ($parent) {
      $origin = "Terminal ($($parent.Name -replace '\.exe$', ''))"
    } else {
      $origin = 'Terminal'
    }

    $port = $listening[[int]$p.ProcessId]
    $servers += [pscustomobject]@{
      Port    = $port
      Url     = "http://localhost:$port/"
      Started = $p.CreationDate
      Origin  = $origin
      Pid     = [int]$p.ProcessId
      RootPid = [int]$top.ProcessId
    }
  }
  return @($servers | Sort-Object Started)
}

function Stop-MyDeckServer($Server) {
  & taskkill.exe /PID $Server.RootPid /T /F 2>&1 | Out-Null
  # Si la chaîne n'a pas pu être tuée en entier, au moins le serveur lui-même.
  if (Get-Process -Id $Server.Pid -ErrorAction SilentlyContinue) {
    Stop-Process -Id $Server.Pid -Force -ErrorAction SilentlyContinue
  }
}

if ($Url) {
  $servers = Get-MyDeckServers
  if ($servers.Count -eq 0) { exit 1 }
  Write-Output $servers[-1].Url
  exit 0
}

if ($StopAll) {
  $servers = Get-MyDeckServers
  foreach ($s in $servers) { Stop-MyDeckServer $s }
  Write-Output "$($servers.Count) serveur(s) arrêté(s)."
  exit 0
}

# --- Menu interactif ---
$Host.UI.RawUI.WindowTitle = 'my-deck - serveurs'
$message = ''
while ($true) {
  Clear-Host
  $servers = Get-MyDeckServers
  Write-Host ''
  Write-Host '  my-deck - serveurs open-slide en cours' -ForegroundColor Cyan
  Write-Host "  $Root" -ForegroundColor DarkGray
  Write-Host ''
  if ($servers.Count -eq 0) {
    Write-Host '  Aucun serveur ne tourne.' -ForegroundColor Green
  } else {
    Write-Host ('  {0,-3} {1,-6} {2,-24} {3,-16} {4,-22} {5}' -f '#', 'Port', 'Adresse', 'Lancé le', 'Origine', 'PID') -ForegroundColor DarkGray
    for ($i = 0; $i -lt $servers.Count; $i++) {
      $s = $servers[$i]
      Write-Host ('  {0,-3} {1,-6} {2,-24} {3,-16} {4,-22} {5}' -f ($i + 1), $s.Port, $s.Url, $s.Started.ToString('dd/MM HH:mm'), $s.Origin, $s.Pid)
    }
    if ($servers.Count -gt 1) {
      Write-Host ''
      Write-Host '  Attention : plusieurs serveurs tournent. Le plus ancien peut servir du code périmé.' -ForegroundColor Yellow
    }
  }
  Write-Host ''
  if ($message) { Write-Host "  $message" -ForegroundColor Green; Write-Host ''; $message = '' }
  Write-Host '  [numéro] arrêter ce serveur   [T] tout arrêter   [O numéro] ouvrir dans le navigateur'
  Write-Host '  [Entrée] actualiser            [Q] quitter'
  Write-Host ''
  $choice = (Read-Host '  Choix').Trim()

  if ($choice -match '^[qQ]$') { break }
  if ($choice -eq '') { continue }
  if ($choice -match '^[tT]$') {
    foreach ($s in $servers) { Stop-MyDeckServer $s }
    $message = "$($servers.Count) serveur(s) arrêté(s)."
    Start-Sleep -Milliseconds 500
    continue
  }
  if ($choice -match '^[oO]\s*(\d+)$') {
    $n = [int]$Matches[1]
    if ($n -ge 1 -and $n -le $servers.Count) { Start-Process $servers[$n - 1].Url; $message = "Ouvert : $($servers[$n - 1].Url)" }
    continue
  }
  if ($choice -match '^\d+$') {
    $n = [int]$choice
    if ($n -ge 1 -and $n -le $servers.Count) {
      Stop-MyDeckServer $servers[$n - 1]
      $message = "Serveur du port $($servers[$n - 1].Port) arrêté."
      Start-Sleep -Milliseconds 500
    }
    continue
  }
}
