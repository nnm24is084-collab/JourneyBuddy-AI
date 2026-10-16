# Module 9 — Google Cloud Platform and IAM
**Reference:** https://cloud.google.com/docs

## Architecture
```text
Clients -> public assets only from intentionally public bucket/CDN
        -> private assets through authenticated API or short-lived signed URL
Backend service account -> least-privilege access to required bucket
```

| Actor | Public assets | Private assets | Admin/config |
|---|---|---|---|
| Visitor | Read only if intentionally public | Deny | Deny |
| Authenticated user | Read | Only authorized objects | Deny |
| Backend service account | Required access only | Required access only | Deny by default |
| Storage administrator | According to assigned admin role | According to assigned admin role | Restricted administrative access |

Use private-by-default buckets, least-privilege IAM roles, dedicated service identities, object-level authorization, short-lived signed URLs where suitable, and audit logs. Do not commit service-account keys. No GCP resources are claimed to have been provisioned.
