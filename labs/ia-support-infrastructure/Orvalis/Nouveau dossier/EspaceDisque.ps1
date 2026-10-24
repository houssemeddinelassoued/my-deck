# =====================================================================
# INVENTAIRE DE L'ESPACE DISQUE DES SERVEURS WINDOWS
# =====================================================================
# Objectif :
#   - Lire une liste de serveurs depuis un fichier texte
#   - Collecter l'espace libre des disques locaux
#   - Générer un rapport CSV pour Excel
#   - N'effectuer aucune modification sur les serveurs
#
# Prérequis :
#   - PowerShell 5.1
#   - Droits de lecture sur les serveurs
#   - Fichier serveurs-test.txt dans le même dossier
# =====================================================================

# Dossier contenant le script
$DossierScript = Split-Path -Parent $MyInvocation.MyCommand.Path

# Fichier contenant la liste des serveurs
$ServeursFile = Join-Path $DossierScript "serveurs-test.txt"

# Nom du rapport
$DateRapport = Get-Date -Format "yyyyMMdd_HHmmss"
$FichierCSV = Join-Path $DossierScript "Rapport_Espace_Disque_$DateRapport.csv"

# Vérifie que le fichier existe
if (-not (Test-Path $ServeursFile))
{
    Write-Host ""
    Write-Host "ERREUR : fichier introuvable :" -ForegroundColor Red
    Write-Host $ServeursFile -ForegroundColor Yellow
    exit 1
}

# Lecture du fichier des serveurs
$Serveurs = Get-Content $ServeursFile | Where-Object {
    -not [string]::IsNullOrWhiteSpace($_)
}

if ($Serveurs.Count -eq 0)
{
    Write-Host "Aucun serveur trouvé dans le fichier." -ForegroundColor Red
    exit 1
}

# Tableau des résultats
$Resultats = @()

# Variables de suivi
$NumeroServeur = 0
$TotalServeurs = $Serveurs.Count

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " INVENTAIRE DES ESPACES DISQUES " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

foreach ($Serveur in $Serveurs)
{
    $NumeroServeur++

    # Barre de progression
    Write-Progress `
        -Activity "Collecte des espaces disques" `
        -Status "Analyse de $Serveur ($NumeroServeur/$TotalServeurs)" `
        -PercentComplete (($NumeroServeur / $TotalServeurs) * 100)

    Write-Host ("[{0}/{1}] Analyse de {2}" -f `
        $NumeroServeur, `
        $TotalServeurs, `
        $Serveur) -ForegroundColor Cyan

    # Simulation d'une collecte réelle
    Start-Sleep -Seconds (Get-Random -Minimum 2 -Maximum 6)

    try
    {
        # Vérifie l'accessibilité du serveur
        $Accessible = Test-Connection `
            -ComputerName $Serveur `
            -Count 1 `
            -Quiet `
            -ErrorAction SilentlyContinue

        if (-not $Accessible)
        {
            Write-Host "    Serveur inaccessible" -ForegroundColor Yellow

            $Resultats += [PSCustomObject]@{
                Serveur          = $Serveur
                Disque           = "N/A"
                GoLibres         = 0
                PourcentageLibre = 0
                Statut           = "Inaccessible"
            }

            continue
        }

        # Lecture des disques locaux
        $Disques = Get-WmiObject `
            -Class Win32_LogicalDisk `
            -ComputerName $Serveur `
            -Filter "DriveType=3"

        foreach ($Disque in $Disques)
        {
            $GoLibres = [Math]::Round(
                $Disque.FreeSpace / 1GB,
                2
            )

            $PourcentageLibre = [Math]::Round(
                ($Disque.FreeSpace / $Disque.Size) * 100,
                2
            )

            $Resultats += [PSCustomObject]@{
                Serveur          = $Serveur
                Disque           = $Disque.DeviceID
                GoLibres         = $GoLibres
                PourcentageLibre = $PourcentageLibre
                Statut           = "OK"
            }
        }

        Write-Host "    Collecte terminee" -ForegroundColor Green
    }
    catch
    {
        Write-Host "    Erreur : $($_.Exception.Message)" -ForegroundColor Red

        $Resultats += [PSCustomObject]@{
            Serveur          = $Serveur
            Disque           = "N/A"
            GoLibres         = 0
            PourcentageLibre = 0
            Statut           = "Erreur"
        }
    }
}

# Ferme la barre de progression
Write-Progress `
    -Activity "Collecte des espaces disques" `
    -Completed

# Export CSV
$Resultats |
    Sort-Object PourcentageLibre |
    Export-Csv `
        -Path $FichierCSV `
        -NoTypeInformation `
        -Delimiter ";" `
        -Encoding UTF8

# ==========================================================
# STATISTIQUES
# ==========================================================

$ServeursOK =
    ($Resultats |
        Where-Object { $_.Statut -eq "OK" } |
        Select-Object -ExpandProperty Serveur -Unique).Count

$ServeursErreur =
    ($Resultats |
        Where-Object { $_.Statut -ne "OK" }).Count

$NombreDisques =
    ($Resultats |
        Where-Object { $_.Statut -eq "OK" }).Count

$MoyenneLibre =
    ($Resultats |
        Where-Object { $_.Statut -eq "OK" } |
        Measure-Object PourcentageLibre -Average).Average

if ($null -eq $MoyenneLibre)
{
    $MoyenneLibre = 0
}

# ==========================================================
# AFFICHAGE DU RAPPORT
# ==========================================================

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " RAPPORT TERMINE " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

Write-Host ("Serveurs analyses  : {0}" -f $ServeursOK) -ForegroundColor White
Write-Host ("Serveurs en erreur : {0}" -f $ServeursErreur) -ForegroundColor White
Write-Host ("Disques recenses   : {0}" -f $NombreDisques) -ForegroundColor White
Write-Host ("Espace libre moyen : {0:N2} %" -f $MoyenneLibre) -ForegroundColor White

Write-Host ""
Write-Host "Top 5 mplis :" -ForegroundColor Red

$Resultats |
    Where-Object { $_.Statut -eq "OK" } |
    Sort-Object PourcentageLibre |
    Select-Object -First 5 `
        Serveur,
        Disque,
        PourcentageLibre |
    Format-Table -AutoSize

Write-Host ""
Write-Host "Rapport CSV genere:" -ForegroundColor Green
Write-Host $FichierCSV -ForegroundColor Yellow
Write-Host ""