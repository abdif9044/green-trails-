# GreenTrails - Production Keystore Management Guide

## 🔐 Critical Keystore Information

**⚠️ WARNING: The keystore file is ESSENTIAL for app updates. If lost, you cannot update your app on the Play Store!**

## Keystore Details

### Production Keystore Configuration
- **Keystore Path:** `android/greentrails-release-key.keystore`
- **Keystore Alias:** `greentrails-key`
- **Validity:** 25 years (until 2049)
- **Algorithm:** RSA 2048-bit

### Required Information for Keystore Creation
```bash
# Command to generate keystore
keytool -genkey -v -keystore greentrails-release-key.keystore -alias greentrails-key -keyalg RSA -keysize 2048 -validity 9125

# When prompted, provide:
# - First and last name: GreenTrails App
# - Organizational unit: Development Team
# - Organization: GreenTrails
# - City: [Your City]
# - State: [Your State]
# - Country code: US (or your country)
```

## Secure Storage Requirements

### 1. Primary Storage
- **Location:** Secure cloud storage (Google Drive, Dropbox, AWS S3)
- **Access:** Restricted to key team members only
- **Encryption:** Additional encryption recommended

### 2. Backup Storage (MANDATORY)
- **Location:** Different cloud provider or physical secure location
- **Frequency:** Immediate after creation
- **Verification:** Test backup integrity regularly

### 3. Team Access
- **Keystore Password:** Store in secure password manager
- **Key Password:** Store separately from keystore password
- **Access Log:** Maintain record of who accesses keystore

## Capacitor Build Configuration

### Android Build Setup
The `capacitor.config.ts` is configured for production builds:

```typescript
android: {
  buildOptions: {
    keystorePath: 'android/greentrails-release-key.keystore',
    keystoreAlias: 'greentrails-key',
    releaseType: 'AAB', // Android App Bundle (required by Play Store)
    signingType: 'apksigner'
  }
}
```

### Build Process
1. **Development Build:**
   ```bash
   npx cap build android
   ```

2. **Production Release Build:**
   ```bash
   # Set environment variables
   export GREENTRAILS_KEYSTORE_PASSWORD="your_keystore_password"
   export GREENTRAILS_KEY_PASSWORD="your_key_password"
   
   # Build signed AAB
   npx cap build android --prod
   ```

## Environment Variables for CI/CD

### GitHub Actions / CI Setup
```yaml
env:
  GREENTRAILS_KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
  GREENTRAILS_KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE_BASE64 }}
```

### Required Secrets
- `KEYSTORE_PASSWORD`: Password for the keystore file
- `KEY_PASSWORD`: Password for the signing key
- `KEYSTORE_FILE_BASE64`: Base64 encoded keystore file

## Security Best Practices

### ✅ DO:
- Use strong, unique passwords for both keystore and key
- Store passwords in a secure password manager
- Create multiple secure backups
- Restrict access to authorized team members only
- Use environment variables for passwords in build systems
- Regularly verify backup integrity
- Document recovery procedures

### ❌ DON'T:
- Commit keystore files to version control
- Share keystore passwords via insecure channels
- Store passwords in plain text files
- Use weak or default passwords
- Give unrestricted access to team members
- Forget to create backups before first upload

## Recovery Procedures

### If Keystore is Lost:
**⚠️ CRITICAL: There is NO recovery if keystore is permanently lost!**

- You CANNOT update the existing app
- You must publish as a completely new app
- All existing users must download the new app
- App ratings and reviews are lost
- App URL and package name must change

### If Password is Forgotten:
**⚠️ CRITICAL: Keystore passwords cannot be recovered!**

- Treat as lost keystore (see above)
- This is why secure password management is essential

## Compliance & Legal

### Google Play Requirements
- **Signing:** All production apps must be signed
- **Target API:** Must target API 34 (Android 14) or higher
- **64-bit:** All apps must include 64-bit native libraries
- **App Bundle:** AAB format recommended for optimal delivery

### Security Compliance
- **Encryption:** Use strong encryption for keystore backups
- **Access Control:** Implement role-based access
- **Audit Trail:** Maintain logs of keystore access
- **Regular Review:** Quarterly security review of keystore management

## Pre-Launch Verification

### ✅ Checklist Before Play Store Upload:
- [ ] Keystore file created and secured
- [ ] Multiple backups verified and accessible
- [ ] Passwords stored in secure password manager
- [ ] Team access documented and restricted
- [ ] Signed AAB file generated successfully
- [ ] App signature verified
- [ ] Target API level confirmed (API 34)
- [ ] Build optimization enabled (ProGuard/R8)

### Test Signing Process:
```bash
# Verify APK signature
apksigner verify --verbose greentrails-release.aab

# Check target API level
aapt dump badging greentrails-release.aab | grep targetSdkVersion
```

## Emergency Contacts

### Keystore Issues:
- **Primary Contact:** [Your Technical Lead]
- **Secondary Contact:** [Your Project Manager]
- **Escalation:** [Your CTO/Technical Director]

### Recovery Time Estimates:
- **Password Reset:** Impossible (new keystore needed)
- **New App Creation:** 2-3 days
- **User Migration:** 2-4 weeks
- **Revenue Impact:** Significant during migration

---

**Remember: The keystore is the most critical asset for your Android app. Treat it with the same security level as financial assets!**