
//TODO: CHECK CONNECTION STATUS
// import { useState, useEffect } from 'react';
// import { employeeService } from '../features/dashboard/services/employeeService';

// export function useOnlineStatus() {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       // Try to sync any pending changes when coming online
//       employeeService.syncPendingChanges();
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   return isOnline;
// }