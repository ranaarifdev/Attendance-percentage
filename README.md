# 7th Semester Attendance Portal

A static attendance lookup page for the Department of Cyber Security, Emerson
University Multan. BS Cyber Security students in the 7th Semester, Evening,
Section A, Session 2023–2027 can search by university roll number or SAP ID.

The interface includes responsive subject cards, a light/dark theme toggle,
search clearing, workbook status and refresh time, and a print-friendly
student report. It displays a student's result only after a successful unique
roll-number or SAP ID match.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Portal layout and relative paths to local assets/data. |
| `style.css` | Responsive dashboard styling. |
| `script.js` | Excel parsing, SAP mapping, validation, and results rendering. |
| `7th Semester Attendance.xlsx` | Default attendance workbook. |
| `Sap ID or Student ID.txt` | SAP ID-to-roll-number mapping. |

SheetJS is loaded from jsDelivr and reads the workbook in the browser. The site has no backend or database.

## Subjects and worksheet tabs

| Workbook worksheet | Portal subject | Teacher |
| --- | --- | --- |
| `Foriegn language` | Foreign Language | Muhammad Ashraf |
| `Digital Foriegnsics` | Digital Forensics | Syed Waqas Shah |
| `Embedded Systems ` | Embedded Systems | Mr. Umair Abid |
| `Parralel And Distributed Comput` | Parallel and Distributed Computing | Aiman Ali Batool |
| `Analysis of Algorithms` | Analysis of Algorithms | Kiran Shahzadi |

## Workbook format

Each worksheet's student data starts at row 7. The portal reads only:

| Column | Meaning |
| --- | --- |
| B | University roll number |
| C | Student name |
| AJ | Total Attendance |
| AK | Attendance Percentage |

The portal ignores the daily marks, lecture dates, and every other workbook column. It displays the saved AJ and AK values; it does not recalculate an individual subject percentage or evaluate Excel formulas. Save the workbook in Excel after updating it so formula results are saved in the file. If a formula result is blank or has no saved value, the portal shows no attendance data rather than deriving a substitute.

Percentages formatted as Excel percentages are displayed according to their Excel format. Numeric percentage values without a percent format are treated as percentage points (`75` displays as `75%`). Invalid or out-of-range values are flagged in the result's workbook data notes.

The subject-attendance total sums available AJ values and is labeled clearly.
The dashboard also counts subjects with saved attendance data. An overall
percentage is not displayed: AJ/AK do not provide a dependable combined
lecture denominator, and inferring or averaging subject percentages could
produce an inaccurate result.

## SAP mapping format

The pipe-delimited mapping file uses SAP ID in its third field and roll number in its fourth field:

```text
| 1 | 3400003226 | ECTE231122145
```

Conflicting SAP mappings are disabled. Duplicate roll numbers within a subject
sheet and roll numbers whose student names conflict across subjects are
excluded to avoid showing an ambiguous record. Roll-number search remains
available if the mapping file is missing. Keep student rows and IDs accurate;
the portal does not invent records.

## Admin Portal & Examination Eligibility

The portal includes a secure, protected administrative interface accessible via the **Staff Portal** link in the footer or by navigating to `#admin`.

### Credentials
- **Username:** `arif2743`
- **Password:** `274300`

### Features
- **Subject-Wise Roster:** View all 43 students across all 5 subjects in an organized, responsive table.
- **Examination Eligibility Rule:** Automatically evaluates student attendance according to university policy:
  - **75% or Higher:** Highlighted with `✓ Eligible` badge (eligible to sit in examinations).
  - **Below 75%:** Highlighted with `✕ Not Eligible` badge (barred from examinations).
  - **Pending Data:** Displayed if percentage value is unrecorded.
- **Print Attendance List:** Generates an official, print-formatted attendance sheet complete with university header, instructor details, eligibility flags, and signature blocks for the Subject Teacher, Incharge Attendance, and Head of Department.
- **Real-Time Search Filter:** Filter students by roll number, name, SAP ID, or by eligibility status (`eligible` / `not eligible`).
- **Session Protection:** Protected by runtime session authentication (`sessionStorage`) with one-click logout.

> **Note on Security:** As a static GitHub Pages deployment, client-side authentication is provided for institutional review and administrative workflow. Enterprise production environments require a protected backend server.

## Local use

Use a static HTTP server such as the VS Code Live Server extension and open `index.html` through it. A `file://` URL may block browser fetches. **Refresh workbook** fetches the configured relative path without using the browser cache. **Choose workbook** loads a selected `.xlsx`/`.xls` file in the browser; a later refresh fetches the configured workbook again.

## GitHub Pages deployment

1. Include `index.html`, `style.css`, `script.js`, `7th Semester Attendance.xlsx`, and `Sap ID or Student ID.txt` in the published repository folder.
2. Enable GitHub Pages for the repository.
3. Open the resulting project URL. Workbook, mapping, style, and script paths are relative to the page and work under a repository subpath.
4. Replace the workbook in the repository when attendance data changes, then click **Refresh workbook**. The workbook URL is configured by `WORKBOOK_URL` in `script.js`.

GitHub Pages is static hosting. A public page makes both the workbook and SAP mapping downloadable by any visitor; browser-side filtering does not secure other students' records. Do not publish identifiable student data publicly unless that exposure is authorized. The page also loads SheetJS from jsDelivr and Google Fonts from Google, so those external resources need internet access.

## Verification notes

The current workbook has five expected worksheets with 43 student identities on each. Direct inspection of B, C, AJ, and AK found saved nonzero examples for roll number `ECTE231122145`: Parallel and Distributed Computing has AJ `9`, AK `75`; Analysis of Algorithms has AJ `8`, AK `88.88888888888889` (displayed according to the workbook's number format). Other sampled rows have AJ `0` and blank AK. Values can change when the workbook is updated.
