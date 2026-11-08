# Signe l'extension pour Firefox sur addons.mozilla.org, en canal privé (« unlisted » :
# rien n'est publié sur la boutique), et dépose le .xpi signé dans web-ext-artifacts\.
# Ce .xpi s'installe de façon permanente dans Firefox (about:addons > roue dentée >
# « Installer un module depuis un fichier »).
#
# Clés : https://addons.mozilla.org/fr/developers/addon/api/key/
# Le script les demande à chaque lancement (rien n'est enregistré). On peut aussi les
# passer par les variables d'environnement AMO_JWT_ISSUER et AMO_JWT_SECRET.
#
# Lancement : powershell -ExecutionPolicy Bypass -File .\sign-firefox.ps1
# Chaque signature exige une version nouvelle dans manifest.json.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$issuer = $env:AMO_JWT_ISSUER
if (-not $issuer) { $issuer = Read-Host "Émetteur JWT (commence par user:)" }

$secret = $env:AMO_JWT_SECRET
if (-not $secret) {
  $secure = Read-Host "Secret JWT (n'apparaît pas à l'écran)" -AsSecureString
  $secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}

$version = (Get-Content manifest.json -Raw | ConvertFrom-Json).version
Write-Host "Signature de la version $version..."

npx --yes web-ext@8 sign `
  --channel=unlisted `
  --source-dir . `
  --artifacts-dir web-ext-artifacts `
  --ignore-files sign-firefox.ps1 "web-ext-artifacts/**" `
  --api-key $issuer `
  --api-secret $secret

if ($LASTEXITCODE -ne 0) { throw "La signature a échoué (voir le message ci-dessus)." }
Write-Host ""
Write-Host "Terminé. Fichier signé :"
Get-ChildItem web-ext-artifacts -Filter *.xpi |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 |
  ForEach-Object { Write-Host $_.FullName }
