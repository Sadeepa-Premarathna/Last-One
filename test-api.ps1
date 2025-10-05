$response = Invoke-RestMethod -Uri 'http://localhost:8003/api/employees'
Write-Output "Found $($response.Count) employees:"
$response | ForEach-Object { 
    Write-Output "- $($_.name) ($($_.employee_id)) - $($_.role)" 
}