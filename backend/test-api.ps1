# Phone Management API Test Script
Write-Host "=== Phone Management API Test ===" -ForegroundColor Green

# Generate unique test username
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testUsername = "testuser$timestamp"

# Test 1: Login as Admin
Write-Host "`n1. Testing Admin Login..." -ForegroundColor Yellow
$loginBody = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "[PASS] Login successful!" -ForegroundColor Green
    $token = $loginResponse.token
    $headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
} catch {
    Write-Host "[FAIL] Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 2: Get Available Roles
Write-Host "`n2. Testing Get Roles..." -ForegroundColor Yellow
try {
    $rolesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/roles" -Method GET -Headers $headers
    Write-Host "✅ Roles retrieved successfully!" -ForegroundColor Green
    foreach ($role in $rolesResponse) {
        Write-Host "   Role ID: $($role.id), Name: $($role.name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Get roles failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get System Users
Write-Host "`n3. Testing Get System Users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method GET -Headers $headers
    Write-Host "✅ System users retrieved successfully!" -ForegroundColor Green
    foreach ($user in $usersResponse) {
        Write-Host "   User ID: $($user.id), Username: $($user.username), Role: $($user.role)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Get system users failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create New System User
Write-Host "`n4. Testing Create System User..." -ForegroundColor Yellow
$newUserBody = @{
    username = $testUsername
    email = "$testUsername@example.com"
    password = "testpass123"
    roleId = 2  # ASSIGNER role
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method POST -Body $newUserBody -Headers $headers
    Write-Host "✅ User created successfully!" -ForegroundColor Green
    Write-Host "   New User ID: $($createResponse.id)" -ForegroundColor Cyan
    Write-Host "   Username: $($createResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($createResponse.role)" -ForegroundColor Cyan
    
    $newUserId = $createResponse.id
} catch {
    Write-Host "❌ Create user failed: $($_.Exception.Message)" -ForegroundColor Red
    $newUserId = $null
}

# Test 5: Update System User (if created)
if ($newUserId) {
    Write-Host "`n5. Testing Update System User..." -ForegroundColor Yellow
    $updateUserBody = @{
        username = "updated$testUsername"
        email = "updated$testUsername@example.com"
        password = "newpass123"
        roleId = 1  # ADMIN role
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users/$newUserId" -Method PUT -Body $updateUserBody -Headers $headers
        Write-Host "✅ User updated successfully!" -ForegroundColor Green
        Write-Host "   Updated Username: $($updateResponse.username)" -ForegroundColor Cyan
        Write-Host "   Updated Role: $($updateResponse.role)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Update user failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Get Phones
Write-Host "`n6. Testing Get Phones..." -ForegroundColor Yellow
try {
    $phonesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/phones" -Method GET -Headers $headers
    Write-Host "✅ Phones retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total phones: $($phonesResponse.content.Count)" -ForegroundColor Cyan
    foreach ($phone in $phonesResponse.content) {
        Write-Host "   Phone ID: $($phone.id), Brand: $($phone.brand), Model: $($phone.model)" -ForegroundColor Cyan
    }
} catch {
    Write-Host ("❌ Get phones failed: {0}" -f $_.Exception.Message) -ForegroundColor Red
}

# Test 7: Get Assignments
Write-Host "`n7. Testing Get Assignments..." -ForegroundColor Yellow
try {
    $assignmentsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/assignments" -Method GET -Headers $headers
    Write-Host "✅ Assignments retrieved successfully!" -ForegroundColor Green
    Write-Host "   Total assignments: $($assignmentsResponse.content.Count)" -ForegroundColor Cyan
    foreach ($assignment in $assignmentsResponse.content) {
        Write-Host "   Assignment ID: $($assignment.id), User: $($assignment.user.firstName) $($assignment.user.lastName)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Get assignments failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Ensure all roles exist (ADMIN, ASSIGNER, TECHNICIAN)
Write-Host "`n0. Ensuring all roles exist..." -ForegroundColor Yellow
$roleNames = @("ADMIN", "ASSIGNER", "TECHNICIAN")
$roleIds = @{}
foreach ($roleName in $roleNames) {
    try {
        $roleCheck = Invoke-RestMethod -Uri "http://localhost:8080/api/roles" -Method GET -Headers $headers
        $role = $roleCheck | Where-Object { $_.name -eq $roleName }
        if (-not $role) {
            $createRoleBody = @{ name = $roleName } | ConvertTo-Json
            $role = Invoke-RestMethod -Uri "http://localhost:8080/api/roles" -Method POST -Body $createRoleBody -Headers $headers
            Write-Host "[PASS] Created role: $roleName (ID: $($role.id))" -ForegroundColor Green
        } else {
            Write-Host "[INFO] Role exists: $roleName (ID: $($role.id))" -ForegroundColor Cyan
        }
        $roleIds[$roleName] = $role.id
    } catch {
        Write-Host "[FAIL] Error ensuring role $($roleName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create a system user for each role
$createdUserIds = @{}
foreach ($roleName in $roleNames) {
    $guid = [guid]::NewGuid().ToString().Substring(0, 8)
    $userName = "${roleName.ToLower()}user$timestamp$guid"
    $userEmail = "$userName@example.com"
    $userPassword = "testpass123"
    $createUserBody = @{ username = $userName; email = $userEmail; password = $userPassword; roleId = $roleIds[$roleName] } | ConvertTo-Json
    try {
        $userResp = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method POST -Body $createUserBody -Headers $headers
        Write-Host "[PASS] Created $roleName user: $userName (ID: $($userResp.id))" -ForegroundColor Green
        $createdUserIds[$roleName] = $userResp.id
    } catch {
        Write-Host "[FAIL] Error creating $roleName user: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create a phone
Write-Host "`nCreating a phone..." -ForegroundColor Yellow
$createPhoneBody = @{ brand = "TestBrand"; model = "TestModel"; isActive = $true } | ConvertTo-Json
try {
    $phoneResp = Invoke-RestMethod -Uri "http://localhost:8080/api/phones" -Method POST -Body $createPhoneBody -Headers $headers
    Write-Host "[PASS] Created phone: $($phoneResp.brand) $($phoneResp.model) (ID: $($phoneResp.id))" -ForegroundColor Green
    $phoneId = $phoneResp.id
} catch {
    Write-Host ("[FAIL] Error creating phone: {0}" -f $_.Exception.Message) -ForegroundColor Red
    $phoneId = $null
}

# Create a sim card
Write-Host "`nCreating a sim card..." -ForegroundColor Yellow
$createSimBody = @{ number = "1234567890$timestamp"; ssid = "SIM$timestamp"; pinCode = "1111"; pukCode = "2222"; forfait = "Standard"; operator = "TestOperator" } | ConvertTo-Json
try {
    $simResp = Invoke-RestMethod -Uri "http://localhost:8080/api/sim-cards" -Method POST -Body $createSimBody -Headers $headers
    Write-Host "[PASS] Created sim card: $($simResp.number) (ID: $($simResp.id))" -ForegroundColor Green
    $simId = $simResp.id
} catch {
    Write-Host "[FAIL] Error creating sim card: $($_.Exception.Message)" -ForegroundColor Red
    $simId = $null
}

# Get a real user (employee) ID for assignment
$employeeUserId = $null
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method GET -Headers $headers
    if ($usersResponse -and $usersResponse.Count -gt 0) {
        $employeeUserId = $usersResponse[0].id
        Write-Host "Using employee user ID: $employeeUserId for assignment test" -ForegroundColor Cyan
    } else {
        Write-Host "[FAIL] No users found in /api/users for assignment test" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] Error fetching users for assignment: $($_.Exception.Message)" -ForegroundColor Red
}

# Assign phone and sim card to employee user
if ($phoneId -and $simId -and $employeeUserId) {
    Write-Host "`nAssigning phone and sim card to employee user..." -ForegroundColor Yellow
    $assignBody = @{ 
        user = @{ id = $employeeUserId }
        phone = @{ id = $phoneId }
        simCard = @{ id = $simId }
        pvFileUrl = "dummy.pdf"
    } | ConvertTo-Json
    Write-Host "Assignment request body:" -ForegroundColor Cyan
    Write-Host $assignBody -ForegroundColor Gray
    Write-Host "user.id: $employeeUserId, phone.id: $phoneId, simCard.id: $simId, pvFileUrl: dummy.pdf" -ForegroundColor Cyan
    try {
        $assignResp = Invoke-RestMethod -Uri "http://localhost:8080/api/assignments" -Method POST -Body $assignBody -Headers $headers
        Write-Host "[PASS] Assignment created: $($assignResp.id)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Error creating assignment: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[FAIL] Cannot assign phone/sim: missing IDs." -ForegroundColor Red
}

# --- Additional Tests ---
$testResults = @()

# 1. Validation: Try to create a user with duplicate username/email
Write-Host "`nValidation: Creating duplicate user (should fail)..." -ForegroundColor Yellow
$dupUserBody = @{ username = $testUsername; email = "$testUsername@example.com"; password = "testpass123"; roleId = $roleIds['ADMIN'] } | ConvertTo-Json
try {
    $dupResp = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method POST -Body $dupUserBody -Headers $headers
    Write-Host "[FAIL] Duplicate user creation succeeded (should fail)" -ForegroundColor Red
    $testResults += "Duplicate user creation: FAIL"
} catch {
    Write-Host "[PASS] Duplicate user creation failed as expected" -ForegroundColor Green
    $testResults += "Duplicate user creation: PASS"
}

# 2. Validation: Missing required field (no password)
Write-Host "`nValidation: Creating user with missing password (should fail)..." -ForegroundColor Yellow
$noPassBody = @{ username = "nopass$timestamp"; email = "nopass$timestamp@example.com"; roleId = $roleIds['ADMIN'] } | ConvertTo-Json
try {
    $noPassResp = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method POST -Body $noPassBody -Headers $headers
    Write-Host "[FAIL] User creation without password succeeded (should fail)" -ForegroundColor Red
    $testResults += "Missing password: FAIL"
} catch {
    Write-Host "[PASS] User creation without password failed as expected" -ForegroundColor Green
    $testResults += "Missing password: PASS"
}

# 3. Validation: Invalid assignment (bad user/phone/sim IDs)
Write-Host "`nValidation: Creating assignment with invalid IDs (should fail)..." -ForegroundColor Yellow
$badAssignBody = @{ userId = 999999; phoneId = 999999; simCardId = 999999; assignmentDate = (Get-Date -Format 'yyyy-MM-dd') } | ConvertTo-Json
try {
    $badAssignResp = Invoke-RestMethod -Uri "http://localhost:8080/api/assignments" -Method POST -Body $badAssignBody -Headers $headers
    Write-Host "[FAIL] Assignment with invalid IDs succeeded (should fail)" -ForegroundColor Red
    $testResults += "Invalid assignment IDs: FAIL"
} catch {
    Write-Host "[PASS] Assignment with invalid IDs failed as expected" -ForegroundColor Green
    $testResults += "Invalid assignment IDs: PASS"
}

# 4. Role-based access: Try forbidden actions
Write-Host "`nRole-based access: ASSIGNER tries to create phone (should fail)..." -ForegroundColor Yellow
$assignerLoginBody = @{ username = "assigner"; password = "assigner123" } | ConvertTo-Json
try {
    $assignerLoginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $assignerLoginBody -ContentType "application/json"
    $assignerToken = $assignerLoginResp.token
    $assignerHeaders = @{ "Authorization" = "Bearer $assignerToken"; "Content-Type" = "application/json" }
    try {
        $failPhoneResp = Invoke-RestMethod -Uri "http://localhost:8080/api/phones" -Method POST -Body $createPhoneBody -Headers $assignerHeaders
        Write-Host "[FAIL] ASSIGNER was able to create a phone (should not be allowed)" -ForegroundColor Red
        $testResults += "ASSIGNER forbidden create phone: FAIL"
    } catch {
        Write-Host "[PASS] ASSIGNER forbidden from creating a phone as expected" -ForegroundColor Green
        $testResults += "ASSIGNER forbidden create phone: PASS"
    }
} catch {
    Write-Host "[FAIL] ASSIGNER login failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "ASSIGNER login: FAIL"
}

# 5. Authentication: Access endpoint without token
Write-Host "`nAuthentication: Accessing endpoint without token (should fail)..." -ForegroundColor Yellow
try {
    $noAuthResp = Invoke-RestMethod -Uri "http://localhost:8080/api/phones" -Method GET
    Write-Host "[FAIL] Access without token succeeded (should fail)" -ForegroundColor Red
    $testResults += "No token access: FAIL"
} catch {
    Write-Host "[PASS] Access without token failed as expected" -ForegroundColor Green
    $testResults += "No token access: PASS"
}

# 6. Authentication: Access endpoint with invalid token
Write-Host "`nAuthentication: Accessing endpoint with invalid token (should fail)..." -ForegroundColor Yellow
$badHeaders = @{ "Authorization" = "Bearer invalidtoken"; "Content-Type" = "application/json" }
try {
    $badAuthResp = Invoke-RestMethod -Uri "http://localhost:8080/api/phones" -Method GET -Headers $badHeaders
    Write-Host "[FAIL] Access with invalid token succeeded (should fail)" -ForegroundColor Red
    $testResults += "Invalid token access: FAIL"
} catch {
    Write-Host "[PASS] Access with invalid token failed as expected" -ForegroundColor Green
    $testResults += "Invalid token access: PASS"
}

# 7. Assignment/Return flow: Assign and return phone
if ($phoneId -and $simId -and $createdUserIds['ASSIGNER']) {
    Write-Host "`nAssignment/Return: Returning phone..." -ForegroundColor Yellow
    try {
        $assignments = Invoke-RestMethod -Uri "http://localhost:8080/api/assignments" -Method GET -Headers $headers
        $assignmentId = $assignments.content[0].id
        $returnResp = Invoke-RestMethod -Uri "http://localhost:8080/api/assignments/$assignmentId/return" -Method PUT -Headers $headers
        Write-Host "[PASS] Phone returned successfully (Assignment ID: $assignmentId)" -ForegroundColor Green
        $testResults += "Assignment return: PASS"
    } catch {
        Write-Host "[FAIL] Phone return failed: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "Assignment return: FAIL"
    }
}

# 8. Data consistency: Check that deleted user is not in list
Write-Host "`nData Consistency: Deleting test user and checking list..." -ForegroundColor Yellow
if ($createdUserIds['TECHNICIAN']) {
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/api/system-users/$($createdUserIds['TECHNICIAN'])" -Method DELETE -Headers $headers
        $usersAfterDelete = Invoke-RestMethod -Uri "http://localhost:8080/api/system-users" -Method GET -Headers $headers
        $deletedUser = $usersAfterDelete | Where-Object { $_.id -eq $createdUserIds['TECHNICIAN'] }
        if (-not $deletedUser) {
            Write-Host "[PASS] Deleted user not found in list as expected" -ForegroundColor Green
            $testResults += "Delete user consistency: PASS"
        } else {
            Write-Host "[FAIL] Deleted user still found in list" -ForegroundColor Red
            $testResults += "Delete user consistency: FAIL"
        }
    } catch {
        Write-Host "[FAIL] Error deleting/checking user: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "Delete user consistency: FAIL"
    }
}

# --- Summary ---
Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Magenta
foreach ($result in $testResults) {
    if ($result -like "*PASS") {
        Write-Host "[PASS] $result" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $result" -ForegroundColor Red
    }
}

Write-Host "`n=== API Test Complete ===" -ForegroundColor Green 