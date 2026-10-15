# Module 2.9: Google Cloud Platform (GCP) — Cloud Storage and IAM



## 1. Objective



The objective of this module is to understand how Google Cloud Platform (GCP) can store application assets securely and control access through Identity and Access Management (IAM).



This conceptual exercise focuses on:



\- Designing a cloud storage bucket structure.

\- Organizing public and private assets.

\- Defining IAM roles and permissions.

\- Understanding least-privilege access.

\- Documenting a proposed cloud resource architecture and access-control matrix.



\*\*Note:\*\* This document describes a proposed GCP design for JourneyBuddy AI. It does not claim that any cloud resources have been created or deployed.



## 2. Introduction



Google Cloud Platform provides cloud infrastructure and services for hosting applications, storing files, and managing access to resources.



Cloud Storage allows applications to store objects such as images, documents, and other assets in buckets.



Identity and Access Management (IAM) controls which identities can perform specific actions on cloud resources. Access can be granted to users, groups, service accounts, or other supported principals through roles and policies.



A secure cloud design should grant each identity only the permissions needed to perform its responsibilities.



## 3. Proposed Cloud Storage Architecture



The proposed architecture separates publicly accessible assets from private application files.



### Public assets



Examples include:



\- Public destination images.

\- Approved static illustrations.

\- Public promotional images.

\- Other assets intentionally made available to website visitors.



### Private assets



Examples include:



\- Internal documents.

\- Restricted application files.

\- User-uploaded documents that should not be publicly accessible.

\- Files requiring application-level authorization.



Private assets should remain private by default. Access should be granted only through appropriate IAM permissions and application authorization.



\*\*Important:\*\* A folder name such as `public/` does not automatically make an object publicly accessible. Actual access depends on bucket policies, IAM permissions, and the configured access controls.



## 4. Proposed Bucket Organization



A conceptual bucket layout could be organized as follows:



```text

JourneyBuddy AI

|

+-- Public Asset Bucket

|   |

|   +-- destinations/

|   +-- illustrations/

|   +-- promotional/

|

+-- Private Asset Bucket

&#x20;   |

&#x20;   +-- user-documents/

&#x20;   +-- internal-files/

&#x20;   +-- restricted-uploads/

```



The public and private buckets are logical design examples. Actual bucket names must follow GCP naming requirements and the project's environment and naming conventions.



Separating public and private assets into different buckets can make access policies easier to review and maintain.



## 5. Proposed Cloud Resource Diagram



```text

&#x20;             JourneyBuddy AI

&#x20;                    |

&#x20;                    v

&#x20;             Application Backend

&#x20;                    |

&#x20;         +----------+----------+

&#x20;         |                     |

&#x20;         v                     v

&#x20;  Public Asset Bucket   Private Asset Bucket

&#x20;         |                     |

&#x20;         v                     v

&#x20;  Approved Public       Authorized Access

&#x20;      Objects           Through Backend

&#x20;         |                     |

&#x20;         v                     v

&#x20;  Website Visitors       Authorized Users

```



The backend should access private objects using an appropriately configured service account or another supported identity mechanism. It should not expose service-account credentials to frontend code.



## 6. Identity and Access Management (IAM)



IAM policies determine which identities can perform which actions on cloud resources.



### Important concepts



\- \*\*Principal:\*\* The identity receiving access, such as a user or service account.

\- \*\*Role:\*\* A collection of permissions.

\- \*\*Permission:\*\* An action that an identity is allowed to perform.

\- \*\*Resource:\*\* The cloud resource on which access is controlled.

\- \*\*IAM policy:\*\* The configuration that binds principals to roles on resources.



### Least-privilege principle



Each identity should receive only the permissions necessary for its assigned task.



For example, a backend service that only needs to read private files should not automatically receive permission to delete objects or administer the entire cloud project.



## 7. Proposed IAM Access-Control Matrix



| Principal | Resource | Intended access |

|---|---|---|

| Public website visitor | Approved public objects | Read approved public assets |

| Backend service account | Private asset bucket | Read only the objects required by the application |

| Authorized upload service | Designated upload location | Create permitted objects |

| Cloud administrator | Required cloud resources | Administrative access according to operational responsibilities |

| Developer | Development resources | Access limited to development needs |



This matrix describes intended access, not existing IAM bindings. The exact predefined or custom roles must be selected after identifying the required operations.



Where possible, grant permissions at the narrowest practical resource scope rather than across the entire project.



## 8. Public and Private Access Controls



### Public access



Public access should be limited to assets intentionally approved for public distribution.



Recommended considerations:



\- Enable Public Access Prevention for buckets that must never be public.

\- Keep private buckets inaccessible to anonymous users.

\- Review IAM policies and bucket-level access settings before publishing assets.

\- Grant public read access only to resources explicitly intended to be public.

\- Avoid storing confidential or personal information in publicly accessible locations.



### Private access



Private resources should require an authorized identity.



Recommended considerations:



\- Use dedicated service accounts for application services.

\- Grant only the required permissions.

\- Keep credentials out of source code and frontend bundles.

\- Review access policies periodically.

\- Audit access where appropriate.

\- Use short-lived credentials or supported identity mechanisms when practical.



Public Access Prevention is a security control that helps prevent public access. It should be configured consistently with the intended access model for each bucket.



## 9. Access-Control Decision Flow



```text

&#x20;          Request for an Object

&#x20;                   |

&#x20;                   v

&#x20;         Identify Requested Asset

&#x20;                   |

&#x20;                   v

&#x20;         Is the Asset Public?

&#x20;              /          \\

&#x20;            Yes           No

&#x20;             |             |

&#x20;             v             v

&#x20;      Check Public     Authenticate

&#x20;      Access Policy    the Request

&#x20;             |             |

&#x20;             v             v

&#x20;      Allow Only if    Check Required

&#x20;      Explicitly       Authorization

&#x20;      Permitted             |

&#x20;             |              v

&#x20;             |       Is Access Allowed?

&#x20;             |          /       \\

&#x20;             |        Yes        No

&#x20;             |         |          |

&#x20;             v         v          v

&#x20;      Return Approved  Return    Deny Access

&#x20;          Asset        Object

```



Actual authorization should use the relevant GCP access controls and application checks. A frontend request or a claimed user identity alone must not be treated as proof of permission.



## 10. Security and Operational Considerations



The proposed cloud design should consider:



\- \*\*Least privilege:\*\* Avoid excessive permissions.

\- \*\*Default privacy:\*\* Keep private assets private unless public access is required.

\- \*\*Credential protection:\*\* Never commit credentials or secret keys to GitHub.

\- \*\*Environment separation:\*\* Use suitable separation between development and production resources.

\- \*\*Auditability:\*\* Review access and relevant audit logs.

\- \*\*Lifecycle management:\*\* Define retention and deletion policies where required.

\- \*\*Cost management:\*\* Monitor storage usage and data transfer.

\- \*\*Secure delivery:\*\* Use suitable authorization mechanisms when private assets must be delivered to users.



For temporary access to private objects, signed URLs may be considered where appropriate. They should be generated securely with suitable expiration times and permissions.



## 11. Testing and Validation Plan



If this design is implemented, the following checks should be performed:



1\. Verify that the required buckets exist in the intended project and environment.

2\. Confirm that approved public assets can be accessed as intended.

3\. Confirm that private objects cannot be accessed anonymously.

4\. Verify that the backend service account can perform only its required operations.

5\. Confirm that unauthorized users cannot retrieve restricted files.

6\. Test the upload workflow using the intended identity and permissions.

7\. Review IAM policies for excessive or unintended permissions.

8\. Confirm that secrets are not present in source code or publicly accessible assets.

9\. Review applicable logging and audit settings.



These checks should be performed in a controlled environment before production deployment.



## 12. Expected Outcome



After completing this conceptual exercise, the expected understanding is:



\- How Cloud Storage organizes objects into buckets.

\- How to separate public and private assets.

\- How IAM roles and policies control resource access.

\- How the principle of least privilege reduces security risks.

\- How to document cloud resources and access-control decisions.

\- How to plan validation of public and private access.



## 13. Deliverables



The deliverables for this module are:



\- This Markdown README.

\- A proposed cloud bucket organization.

\- A cloud resource architecture diagram.

\- An IAM access-control matrix.

\- Public/private access-control design notes.

\- A security testing and validation plan.



## 14. Official Documentation



Google Cloud documentation: https://cloud.google.com/docs



Cloud Storage documentation: https://cloud.google.com/storage/docs



IAM documentation: https://cloud.google.com/iam/docs



Refer to the official documentation for current guidance on bucket access, IAM policies, service accounts, and public access prevention.



## 15. Conclusion



Google Cloud Platform provides storage and access-management capabilities that can support JourneyBuddy AI's cloud architecture. By separating public and private assets, applying least-privilege IAM policies, and validating access permissions, the proposed design aims to keep application resources accessible to the right identities while protecting restricted information.



