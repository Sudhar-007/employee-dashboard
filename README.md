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
  
- **Details Page - Camera Stream Timing** :
getUserMedia returned stream before video element rendered in DOM.
Fixed by setting phase to 'camera' first to trigger render, 
then setting srcObject after 100ms timeout.

- **Details Page - Signature Canvas Coordinates** :
Signature wasn't drawing visibly because mouse coordinates weren't 
scaled to canvas internal dimensions. Fixed by calculating scaleX/scaleY 
as canvas.width / rect.width and multiplying coordinates by scale factors.

- **Details Page - Blob Merge Null Reference** :
photoCanvasRef was null during mergeAndSave because canvas unmounts 
when phase changes. Fixed by loading photo state as Image object 
and drawing from that instead of the canvas ref.

- **React StrictMode Double Fetch**
In development, React StrictMode intentionally mounts components twice 
to detect side effects. This caused useEffect to fire twice, sending two 
simultaneous POST requests to the API. One request succeeded while the 
other failed, triggering the catch block and showing "Failed to fetch data" 
despite valid data being returned.Fixed by adding AbortController to the fetch in List.jsx. When StrictMode 
unmounts and remounts the component, the cleanup function calls 
controller.abort() which cancels the first in-flight request. The second 
request completes cleanly. AbortError is caught separately and ignored 
since it is an expected cancellation, not a real network failure.
