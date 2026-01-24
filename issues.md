<!--
issues.md - Bulk Issue Creation
To add a new issue, append a new block to the end of this file using the format below.

Formatting Rules:
1. Separator: Each issue MUST be separated by "---" on a new line.
2. Fields:
   - title: (Required) The title of the issue.
   - description: (Required) The body of the issue. Use | for multi-line block strings.
   - labels: (Optional) A list of labels to apply. 'good first issue' is always applied automatically.
3. Order: Append new issues to the BOTTOM.
4. Duplicates: Issues with a title matching an OPEN issue will be skipped.

Example:
---
title: Fix login page typo
description: |
  There is a typo in the login header.
  "Sing in" should be "Sign in".
labels:
  - bug
  - frontend
---
-->

# Pending Issues
<!-- Add your new issues below this line -->

---
title: Documentation: Add contribution guidelines
description: |
  We need a CONTRIBUTING.md file to help new contributors understand how to setup the project and submit PRs.
  
  Please include:
  - Setup steps
  - Coding standards
  - PR process
labels:
  - documentation
  - help wanted

---
title: Feature: Dark mode toggle
description: |
  Implement a simple dark mode toggle in the header.
  It should persist preference to localStorage.
labels:
  - frontend
  - enhancement
