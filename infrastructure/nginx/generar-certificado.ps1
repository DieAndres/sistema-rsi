param()
$ErrorActionPreference = 'Stop'
$taskOpenSSL = Get-Command openssl -ErrorAction SilentlyContinue
if ($taskOpenSSL) { $taskExecutable = $taskOpenSSL.Source }
elseif (Test-Path 'C:/Program Files/Git/usr/bin/openssl.exe') { $taskExecutable = 'C:/Program Files/Git/usr/bin/openssl.exe' }
else { throw 'Se necesita OpenSSL (disponible con Git para Windows).' }

$taskCertDirectory = Join-Path $PSScriptRoot 'certs'
$taskCertificate = Join-Path $taskCertDirectory 'server.crt'
$taskKey = Join-Path $taskCertDirectory 'server.key'
if ((Test-Path $taskCertificate) -and (Test-Path $taskKey)) {
    Write-Output 'Ya existe el certificado local; se conserva.'
    exit 0
}
if ((Test-Path $taskCertificate) -or (Test-Path $taskKey)) { throw 'Hay un certificado incompleto. Revisar los archivos antes de generar otro.' }
New-Item -ItemType Directory -Path $taskCertDirectory -Force | Out-Null
& $taskExecutable req -x509 -newkey rsa:3072 -sha256 -nodes -days 365 -keyout $taskKey -out $taskCertificate -subj '/CN=localhost' -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1' -addext 'extendedKeyUsage=serverAuth' -addext 'basicConstraints=critical,CA:FALSE'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo generar el certificado.' }
Write-Output 'Certificado local creado. No se instala como autoridad de confianza en Windows.'
