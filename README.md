# Employee Insights Dashboard

A 4-screen React application built as an internship assignment.

## Tech Stack
- React (Vite)
- React Router DOM
- Raw CSS (no UI libraries)

## Progress
- [x] Screen 1 - Login with Auth Context + localStorage persistence
- [x] Screen 2 - Employee List with custom virtualization
- [x] Screen 3 - Details, Camera, Signature, Blob Merge
- [x] Screen 4 - Analytics, SVG Chart, Map
- [x] Intentional bug documented
- [ ] Screen recording

## Virtualization Math
Each row is a fixed 48px height. On scroll, startIndex and endIndex 
are calculated from scrollTop divided by ROW_HEIGHT. Only the visible 
slice of employees is rendered, offset by translateY to maintain correct 
scroll position. Total container height stays at employees.length * ROW_HEIGHT 
so the scrollbar remains accurate.

startIndex = Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
endIndex = startIndex + Math.ceil(VISIBLE_HEIGHT / ROW_HEIGHT) + BUFFER * 2
visibleEmployees = employees.slice(startIndex, endIndex)
offsetY = startIndex * ROW_HEIGHT

## Intentional Bug

**Location:** `src/pages/List.jsx` — handleScroll useCallback

**What it is:** handleScroll is memoized with useCallback with an empty 
dependency array []. If the employees array were to update after initial 
mount, handleScroll would reference a stale closure of the old employees 
value rather than the updated one.

**Type:** Stale closure — missing dependency in useCallback

**Why I chose it:** This is a subtle React lifecycle bug that doesn't 
break current functionality since employees loads once on mount. However 
if the component were extended to support real-time data updates or 
filtering, the stale closure would cause handleScroll to reference 
outdated employee data. It demonstrates understanding of React's 
memoization and closure behaviour without breaking the working app.

## Geospatial Mapping
The API returns only city names without coordinates. Cities are matched 
to lat/lng via a static CITY_COORDS lookup table in Analytics.jsx. 
Each unique city from the dataset is checked against this table and 
rendered as a Leaflet Marker if coordinates exist.


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

- **React StrictMode Double Fetch** :
In development, React StrictMode intentionally mounts components twice 
to detect side effects. This caused useEffect to fire twice, sending two 
simultaneous POST requests to the API. One request succeeded while the 
other failed, triggering the catch block and showing "Failed to fetch data" 
despite valid data being returned.Fixed by adding AbortController to the fetch in List.jsx. When StrictMode 
unmounts and remounts the component, the cleanup function calls 
controller.abort() which cancels the first in-flight request. The second 
request completes cleanly. AbortError is caught separately and ignored 
since it is an expected cancellation, not a real network failure.
