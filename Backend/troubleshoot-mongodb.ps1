# MongoDB Atlas Connection Troubleshooting Script for Windows
# Run this script as Administrator if you're having DNS issues

Write-Host "🔧 MongoDB Atlas Connection Troubleshooting" -ForegroundColor Cyan
Write-Host "==========================================="

# Check current DNS servers
Write-Host "`n1. Checking current DNS configuration..." -ForegroundColor Yellow
Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"} | Format-Table

# Test DNS resolution for MongoDB Atlas
Write-Host "`n2. Testing DNS resolution for MongoDB Atlas..." -ForegroundColor Yellow
$mongoHost = "cluster0.82iazhd.mongodb.net"
try {
    $dnsResult = Resolve-DnsName $mongoHost -ErrorAction Stop
    Write-Host "✅ DNS Resolution successful for $mongoHost" -ForegroundColor Green
    $dnsResult | Format-Table
} catch {
    Write-Host "❌ DNS Resolution failed for $mongoHost" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test SRV record (MongoDB Atlas uses SRV records)
Write-Host "`n3. Testing SRV record resolution..." -ForegroundColor Yellow
$srvRecord = "_mongodb._tcp.cluster0.82iazhd.mongodb.net"
try {
    $srvResult = Resolve-DnsName $srvRecord -Type SRV -ErrorAction Stop
    Write-Host "✅ SRV record resolution successful" -ForegroundColor Green
    $srvResult | Format-Table
} catch {
    Write-Host "❌ SRV record resolution failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host "`n🔧 Suggested fixes:" -ForegroundColor Cyan
    Write-Host "1. Change DNS servers to Google DNS (8.8.8.8, 8.8.4.4)" -ForegroundColor White
    Write-Host "2. Flush DNS cache: ipconfig /flushdns" -ForegroundColor White
    Write-Host "3. Restart network adapter" -ForegroundColor White
    Write-Host "4. Check firewall settings" -ForegroundColor White
    Write-Host "5. Try from a different network" -ForegroundColor White
}

# Check internet connectivity
Write-Host "`n4. Testing general internet connectivity..." -ForegroundColor Yellow
try {
    Test-NetConnection google.com -Port 80 -InformationLevel Quiet | Out-Null
    Write-Host "✅ Internet connection is working" -ForegroundColor Green
} catch {
    Write-Host "❌ Internet connection issues detected" -ForegroundColor Red
}

# MongoDB Atlas port test
Write-Host "`n5. Testing MongoDB Atlas connectivity..." -ForegroundColor Yellow
try {
    Test-NetConnection cluster0-shard-00-00.82iazhd.mongodb.net -Port 27017 -InformationLevel Detailed
} catch {
    Write-Host "❌ Cannot connect to MongoDB Atlas on port 27017" -ForegroundColor Red
}

Write-Host "`n🔧 Quick Fixes to Try:" -ForegroundColor Cyan
Write-Host "1. Run: ipconfig /flushdns" -ForegroundColor White
Write-Host "2. Change DNS to 8.8.8.8 and 8.8.4.4" -ForegroundColor White
Write-Host "3. Temporarily disable Windows Firewall" -ForegroundColor White
Write-Host "4. Check MongoDB Atlas IP whitelist" -ForegroundColor White
Write-Host "5. Try connecting from MongoDB Compass" -ForegroundColor White

Write-Host "`n✅ Troubleshooting complete!" -ForegroundColor Green