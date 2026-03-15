# Employee Insights Dashboard

A 4-screen React application built as an internship assignment.

## Tech Stack
- React (Vite)
- React Router DOM
- Raw CSS (no UI libraries)

## Progress
- [x] Screen 1 - Login with Auth Context + localStorage persistence
- [x] Screen 2 - Employee List with custom virtualization
- [ ] Screen 3 - Details, Camera, Signature, Blob Merge
- [ ] Screen 4 - Analytics, SVG Chart, Map
- [ ] Intentional bug documented
- [ ] Screen recording

## Virtualization Math
Each row is a fixed 48px height. On scroll, startIndex and endIndex are calculated from scrollTop divided by ROW_HEIGHT. Only the visible slice of employees is rendered, offset by translateY to maintain correct scroll position. Total container height stays at employees.length * ROW_HEIGHT so the scrollbar remains accurate.

## Debugging Notes
- API returned nested structure TABLE_DATA.data instead of a flat array
- Each employee is an array not an object — fields accessed by index (emp[0]=name, emp[2]=city, emp[3]=id, emp[5]=salary)
